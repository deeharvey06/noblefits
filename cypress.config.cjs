const { defineConfig } = require("cypress");
module.exports = defineConfig({
  e2e: {
    baseUrl: process.env.CYPRESS_BASE_URL || "http://localhost:3000",
    defaultCommandTimeout: 10000,
    specPattern: "cypress/e2e/**/*.cy.js",
    supportFile: false,
    setupNodeEvents(on) {
      on("before:browser:launch", (browser, launchOptions) => {
        if (browser.name === "electron") {
          launchOptions.preferences.width = 1600;
          launchOptions.preferences.height = 1200;
        }
        return launchOptions;
      });
    },
  },
  video: false,
  allowCypressEnv: false,
});
