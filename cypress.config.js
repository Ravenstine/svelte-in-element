import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    specPattern: "**/*test.{js,ts}",
    baseUrl: 'http://localhost:1337',
    video: false,
  },
});
