import { expect, test } from '@playwright/test';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

test.describe.serial('JastipVIP order flow', () => {
  test.afterAll(async () => {
    await prisma.$disconnect();
  });

  test('order API rejects missing required fields without customer auth', async ({ request }) => {
    const formData = new FormData();
    formData.set('customerName', 'E2E Missing Fields');
    formData.set('brand', 'No DP Scenario');
    // intentionally omit customerId, whatsappNumber and dpPercentage

    const response = await request.post('/api/orders', {
      multipart: {
        customerName: String(formData.get('customerName')),
        brand: String(formData.get('brand')),
      },
    });

    expect(response.status()).toBe(401);
    const payload = await response.json();
    expect(payload.error).toContain('terdaftar');
  });

  test('admin login fails with wrong password', async ({ page }) => {
    await page.goto('/admin');
    await page.locator('input[type="password"]').fill('wrong-password');
    await page.getByRole('button', { name: 'Akses Dashboard' }).click();

    await expect(page).toHaveURL(/\/admin$/);
    await expect(page.getByText('Password salah')).toBeVisible();
  });

  test('customer register -> submit order -> database -> tracking -> admin update', async ({ page }) => {
    const runId = Date.now();
    const fullName = `E2E Customer ${runId}`;
    const customerEmail = `e2e${runId}@test.local`;
    const whatsappNumber = `08123${String(runId).slice(-8)}`;
    const password = 'TestPassword123';
    const customerName = `E2E User ${runId}`;
    const brand = `Nike Air Force 1 ${runId}`;
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

    // Step 1: Register as a customer
    await page.goto('/register');
    await page.locator('input[id="fullName"]').fill(fullName);
    await page.locator('input[id="whatsappNumber"]').fill(whatsappNumber);
    await page.locator('input[id="email"]').fill(customerEmail);
    await page.locator('input[id="password"]').fill(password);
    await page.locator('input[id="confirmPassword"]').fill(password);
    
    const registerResponsePromise = page.waitForResponse((response) =>
      response.url().includes('/api/customers/register') && response.request().method() === 'POST'
    );
    await page.getByRole('button', { name: /Daftar Sekarang/i }).click();
    const registerResponse = await registerResponsePromise;
    expect(registerResponse.ok()).toBeTruthy();

    const registerPayload = await registerResponse.json();
    expect(registerPayload.success).toBe(true);
    const customerId = registerPayload.customer.id;

    // Step 2: Navigate back to home and submit order
    await page.goto('/?registered=1');
    await page.locator('button:has-text("Titip Barang Sekarang")').click();

    // Set localStorage markers for client-side auth
    await page.evaluate((cId) => {
      localStorage.setItem('customer_session_marker', 'true');
      localStorage.setItem('customer_id', cId);
    }, customerId);

    // Reload to trigger auth check
    await page.reload();
    await page.locator('button:has-text("Titip Barang Sekarang")').click();

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
      where: { customerId, customerName, brand },
    });

    expect(createdOrder).not.toBeNull();
    expect(createdOrder?.status).toBe('PENDING');
    expect(createdOrder?.dpPercentage).toBe(50);
    expect(trackingHref).toBe(`/track/${createdOrder?.id}`);

    await page.goto(trackingHref as string);
    await expect(page.getByText(createdOrder!.id)).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Menunggu Konfirmasi' })).toBeVisible();

    await page.goto('/admin');
    await page.locator('input[type="password"]').fill(adminPassword);
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

    // Cleanup: Delete test data
    await prisma.order.delete({ where: { id: createdOrder!.id } });
    await prisma.customer.delete({ where: { id: customerId } });
  });
});
