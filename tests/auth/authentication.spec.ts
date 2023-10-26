import { test } from '@playwright/test';

test.use({
  ignoreHTTPSErrors: true,
});

const email = `random-email${Math.random()}@mail.local`;
const password = 'RandomPassword' + Math.random();

test.describe.serial('Authentication', () => {
  test('create new account', async ({ page }) => {
    await page.goto('https://accounts.anthaathi.local:4443/v1/sign-in', {
      waitUntil: 'networkidle',
    });

    await page.getByLabel('Email / Username').click();
    await page.getByRole('link', { name: 'Register now' }).click();
    await page.waitForLoadState('networkidle'); // This resolves after 'networkidle'
    await page.getByLabel('First name').fill('Omkar');
    await page.getByLabel('First name').press('Tab');
    await page.getByLabel('Password', { exact: true }).fill(password);
    await page.getByRole('button', { name: 'Show password text' }).click();
    await page.getByLabel('Last name').click();
    await page.getByLabel('Last name').fill('Yadav');
    await page.getByLabel('Last name').press('Tab');
    await page.getByLabel('E-Mail').fill(email);
    await page.getByLabel('E-Mail').press('Tab');
    await page.getByRole('button', { name: 'Create Account' }).click();
    await page.waitForURL('https://my-account.anthaathi.local:4443/', {
      waitUntil: 'networkidle',
    });
    await page.getByTestId('email-verification-remind-me-later').click();
    await page.getByTestId('profile-button').click();
    await page.getByTestId('logout').click();
    await page.waitForURL(
      'https://accounts.anthaathi.local:4443/v1/sign-in',
      {}
    );
  });

  test('sign in account', async ({ page }) => {
    await page.goto('https://accounts.anthaathi.local:4443/v1/sign-in', {
      waitUntil: 'networkidle',
    });
    await page.getByLabel('Email / Username').click();
    await page.getByLabel('Email / Username').fill(email);
    await page.getByLabel('Email / Username').press('Tab');
    await page.getByLabel('Password', { exact: true }).fill(password);
    await page.getByLabel('Password', { exact: true }).press('Tab');
    await page.getByRole('button', { name: 'Show password text' }).press('Tab');
    await page.getByRole('link', { name: 'Forget password?' }).press('Tab');
    await page
      .getByRole('button', { name: 'Sign In', exact: true })
      .press('Enter');
    await page.waitForURL('https://my-account.anthaathi.local:4443/', {
      waitUntil: 'networkidle',
    });
    await page.getByTestId('email-verification-remind-me-later').click();
    await page.getByTestId('profile-button').click();
    await page.getByTestId('logout').click();
    await page.waitForURL(
      'https://accounts.anthaathi.local:4443/v1/sign-in',
      {}
    );
  });
});
