import * as Selectores from "./selectores";

// Comando personalizado para pre-validaciones del inicio de sesión
Cypress.Commands.add("co_PreValidaciones", () => {
  cy.get(Selectores.LOGO).should("exist").and("be.visible");
  cy.get(Selectores.CONTENEDOR_NEGRO).should("have.css", "background-color","rgb(19, 35, 34)");
  cy.get(Selectores.CREDENCIALES_USUARIOS).should("exist").and("be.visible");
  cy.get(Selectores.CREDENCIALES_CLAVES).should("exist").and("be.visible");
});

// Comando personalizado para iniciar sesión
Cypress.Commands.add("co_IniciarSesion", (nombreUsuario, clave) => {
  cy.get(Selectores.NOMBREUSUARIO).type(nombreUsuario);
  cy.get(Selectores.CLAVE).type(clave);
  cy.get(Selectores.BOTON_INGRESAR).click();
});

// Comando para obtener nombre y precio del producto con alias dinámico
Cypress.Commands.add("co_NombrePrecioProducto", (aliasProducto, selectorNombre, selectorPrecio) => {
  cy.get(selectorNombre).invoke("text").then((texto) => {
      cy.wrap(texto.trim()).as(`${aliasProducto}Nombre`);
    });
  cy.get(selectorPrecio).invoke("text").then((texto) => {
      cy.wrap(texto.trim()).as(`${aliasProducto}Precio`);
    });
});

// Comando personalizado para comparar texto del producto en el carrito
Cypress.Commands.add("co_CompararTextoProducto", (alias, selector) => {
  cy.get(alias).then((textoGuardado) => {
    cy.get(selector).invoke("text").then((textoActualProceso) => {
        expect(textoActualProceso.trim()).to.eq(textoGuardado.trim());
      });
  });
});