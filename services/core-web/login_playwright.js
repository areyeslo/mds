const { chromium } = require("playwright");
let assert = require("assert");

(async () => {
  const browser = await chromium.launch({
    headless: false,
  });
  const context = await browser.newContext();

  // Open new page
  const page = await context.newPage();

  // Go to http://localhost:3000/
  await page.goto("http://localhost:3000/");

  // Click input[name="username"]
  await page.click('input[name="username"]');

  // Fill input[name="username"]
  await page.fill('input[name="username"]', "bdd-test-create");

  // Click input[name="password"]
  await page.click('input[name="password"]');

  // Fill input[name="password"]
  await page.fill('input[name="password"]', "JiAX90*pK7L&5r2GbE@m");

  // Click text=Log In
  await page.click("text=Log In");
  // assert.equal(page.url(), 'http://localhost:3000/home/#state=4915f1ce-82f8-446c-aab4-12842f0cc3a2&session_state=94ce9a5a-3096-4664-a389-716a2c6ffefe&code=3675cd1a-b97b-4152-bf96-34854195f505.94ce9a5a-3096-4664-a389-716a2c6ffefe.ba58208e-e55c-417b-b845-bd472b79c6da');

  // Go to http://localhost:3000/home/
  await page.goto("http://localhost:3000/home/");

  // Click button:has-text("bdd-test-create")
  await page.click('button:has-text("bdd-test-create")');

  // Click text=Log Out
  await page.click("text=Log Out");

  await page.once("load", () => {});
  await page.waitForTimeout(1000);
  await page.screenshot({ path: "screenshot.png" });

  assert.strictEqual(page.url(), "http://localhost:3000/logout-confirmed/", "Logout url");

  // Click [aria-label="close"] svg
  await page.click('[aria-label="close"] svg');

  // ---------------------
  await context.close();
  await browser.close();
})();
