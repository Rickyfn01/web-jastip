import { expect, test } from '@playwright/test';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

test.describe.serial('Customer registration', () => {
  test.afterAll(async () => {
    await prisma.$disconnect();
  });

  test('new buyer can create an account', async ({ page }) => {
    const runId = Date.now();
    const fullName = `Buyer ${runId}`;
    const whatsappNumber = `08177${String(runId).slice(-8)}`;
    const email = `buyer${runId}@example.com`;
    const password = `BuyerPass${runId}`;

    await page.goto('/register');
    await page.locator('#fullName').fill(fullName);
    await page.locator('#whatsappNumber').fill(whatsappNumber);
    await page.locator('#email').fill(email);
    await page.locator('#password').fill(password);
    await page.locator('#confirmPassword').fill(password);
    await page.getByRole('button', { name: 'Daftar Sekarang' }).click();

    await expect(page).toHaveURL(/registered=1/);

    const customer = await prisma.customer.findFirst({
      where: { whatsappNumber, email },
    });

    expect(customer).not.toBeNull();
    expect(customer?.fullName).toBe(fullName);

    await prisma.customer.delete({ where: { id: customer!.id } });
  });
});