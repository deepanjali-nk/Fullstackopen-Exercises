import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    chromeWebSecurity: false,
  },

  component: {
    devServer: {
      framework: "react",
      bundler: "vite",
    },
  },


});
