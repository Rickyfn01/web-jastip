import { expect, test } from '@playwright/test';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

test.describe.serial('JastipVIP order flow', () => {
  test.afterAll(async () => {
    await prisma.$disconnect();
  });

  test('order API rejects missing required fields', async ({ request }) => {
    const formData = new FormData();
    formData.set('customerName', 'E2E Missing Fields');
    formData.set('brand', 'No DP Scenario');
    // intentionally omit whatsappNumber and dpPercentage

    const response = await request.post('/api/orders', {
      multipart: {
        customerName: String(formData.get('customerName')),
        brand: String(formData.get('brand')),
      },
    });

    expect(response.status()).toBe(400);
    const payload = await response.json();
    expect(payload.error).toContain('wajib diisi');
  });

  test('admin login fails with wrong password', async ({ page }) => {
    await page.goto('/admin');
    await page.locator('input[type="password"]').fill('wrong-password');
    await page.getByRole('button', { name: 'Akses Dashboard' }).click();

    await expect(page).toHaveURL(/\/admin$/);
    await expect(page.getByText('Password salah')).toBeVisible();
  });

  test('customer submit -> database -> tracking -> admin update', async ({ page }) => {
    const runId = Date.now();
    const customerName = `E2E User ${runId}`;
    const brand = `Nike Air Force 1 ${runId}`;
    const whatsappNumber = `08123${String(runId).slice(-8)}`;
    const password = process.env.ADMIN_PASSWORD || 'admin123';

    await page.goto('/');
    await page.locator('button#request-form').click();

    await page.locator('input[name="customerName"]').fill(customerName);
    await page.locator('input[name="whatsappNumber"]').fill(whatsappNumber);
    await page.locator('input[name="brand"]').fill(brand);
    await page.locator('select[name="dpPercentage"]').selectOption('50');

    const submitResponsePromise = page.waitForResponse((response) =>
      response.url().includes('/api/orders') && response.request().method() === 'POST'
    );
    await page.getByRole('button', { name: 'Kirim Permintaan' }).click();
    const submitResponse = await submitResponsePromise;
    expect(submitResponse.ok()).toBeTruthy();

    const submitPayload = await submitResponse.json();
    expect(submitPayload.success).toBe(true);
    await expect(page.getByText('Permintaan Terkirim!')).toBeVisible();

    const trackingHref = await page.locator('a', { hasText: 'Lacak Pesanan Saya' }).getAttribute('href');
    expect(trackingHref).toBeTruthy();
    expect(trackingHref).toMatch(/^\/track\//);

    const createdOrder = await prisma.order.findFirst({
      where: { customerName, brand, whatsappNumber },
    });

    expect(createdOrder).not.toBeNull();
    expect(createdOrder?.status).toBe('PENDING');
    expect(createdOrder?.dpPercentage).toBe(50);
    expect(trackingHref).toBe(`/track/${createdOrder?.id}`);

    await page.goto(trackingHref as string);
    await expect(page.getByText(createdOrder!.id)).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Menunggu Konfirmasi' })).toBeVisible();

    await page.goto('/admin');
    await page.locator('input[type="password"]').fill(password);
    await page.getByRole('button', { name: 'Akses Dashboard' }).click();
    await expect(page).toHaveURL(/\/admin\/dashboard/);

    await page.goto(`/admin/orders/${createdOrder!.id}`);
    await expect(page.getByText('Kelola Pesanan')).toBeVisible();

    await page.locator('select').first().selectOption('CHECKING');
    await page.locator('input[type="number"]').first().fill('1200000');
    await page.getByRole('button', { name: 'Hitung + Jastip (25k) + DP' }).click();

    await expect(page.locator('input[type="number"]').nth(1)).toHaveValue('1225000');
    await expect(page.locator('input[type="number"]').nth(2)).toHaveValue('612500');

    await page.getByRole('button', { name: 'Simpan Perubahan' }).click();
    await expect(page.getByText('Perubahan berhasil disimpan!')).toBeVisible();

    await page.goto(`/track/${createdOrder!.id}`);
    await expect(page.getByRole('heading', { name: 'Pengecekan Stok' })).toBeVisible();
    await expect(page.getByText('Rp 1.200.000')).toBeVisible();
    await expect(page.getByText('Rp 1.225.000')).toBeVisible();

    await prisma.order.delete({ where: { id: createdOrder!.id } });
  });
});
