module.exports = {
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: "http://192.168.56.1:3000", // Cambia esto a la URL base de tu aplicación
    specPattern: "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",
  },
  component: {
    devServer: {
      framework: "react",
      bundler: "vite", // Cambiado de webpack a vite
    },
  },
};
