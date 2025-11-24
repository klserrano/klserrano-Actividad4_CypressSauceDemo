module.exports = {
  e2e: {
    //Base URLs de las diferentes partes de la aplicación
    baseUrl: "https://www.saucedemo.com/",
    setupNodeEvents(on, config) {},
    //Reintentos para casos de prueba fallidos
    retries: {
      openMode: 1,
      runMode: 1,
    },
  },
};

