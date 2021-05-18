const { openBrowser, goto, click, write, hover, screenshot, closeBrowser } = require("taiko");
(async () => {
  try {
    await openBrowser({ args: ["--window-size=1900,900"] });
    await goto("localhost:3000");
    await click("username");
    await write("bdd-test-create");
    await click("password");
    await write("JiAX90*pK7L&5r2GbE@m");
    await click("Log In");
    await click("bdd-test-create");
    await click("Log Out");
    await screenshot();
  } catch (error) {
    console.error(error);
  } finally {
    await closeBrowser();
  }
})();
