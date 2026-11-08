const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://suninjuly.github.io',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: false,
    experimentalRunAllSpecs: false,
    setupNodeEvents(on, config) {
      on('task', {
        log(message) {
          console.log(message)
          return null
        },
      })
      return config
    },
  },
  // Give Mocha enough time for the remote page + timer window
  defaultCommandTimeout: 10000,
  pageLoadTimeout: 30000,
  video: false,
})
