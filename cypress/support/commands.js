import * as Selector from "./selectores";

// Comando de pre-validaciones del inicio de sesión
Cypress.Commands.add("co_PreValidaciones", () => {
  cy.url().should("include", "saucedemo");
  cy.get(Selector.LOGO).should("exist").and("be.visible");
  cy.get(Selector.CONTENEDOR_NEGRO).should(
    "have.css",
    "background-color",
    "rgb(19, 35, 34)"
  );
  cy.get(Selector.CREDENCIALES_USUARIOS).should("exist").and("be.visible");
  cy.get(Selector.CREDENCIALES_CLAVES).should("exist").and("be.visible");
});

// Comando de inicio de sesión
Cypress.Commands.add("co_IniciarSesion", (nombreUsuario, clave) => {
  cy.get(Selector.NOMBREUSUARIO).type(nombreUsuario);
  cy.get(Selector.CLAVE).type(clave);
  cy.get(Selector.BOTON_INGRESAR).click();
});

// Validaciones de inicio de sesión exitosa
Cypress.Commands.add("co_ValidarInicioSesionExitosa", () => {
  cy.url().should("include", "/inventory.html");
  cy.get(Selector.TITULOPRODUCTOS).should("exist").and("be.visible");
  cy.get(Selector.ICONO_CARRITO).should("exist").and("be.visible");
});

// Comando para adicionar tres productos al carrito
Cypress.Commands.add("co_AdicionarProductos", () => {
  cy.get(Selector.BOTON_AGREGAR_MOCHILA).click();
  cy.get(Selector.BOTON_AGREGAR_CHAQUETA).click();
  cy.get(Selector.BOTON_AGREGAR_MAMELUCO).click();
});

// Comando para verificar que los productos agregados al carrito cambien de estado a "Remove"
Cypress.Commands.add("co_ValidarEstado", () => {
  cy.get(Selector.BOTON_REMOVER_MOCHILA)
    .should("exist")
    .and("be.visible")
    .and("contain.text", "Remove");
  cy.get(Selector.BOTON_REMOVER_CHAQUETA)
    .should("exist")
    .and("be.visible")
    .and("contain.text", "Remove");
  cy.get(Selector.BOTON_REMOVER_MAMELUCO)
    .should("exist")
    .and("be.visible")
    .and("contain.text", "Remove");
});

// Comando de navegación al carrito de compras y validaciones
Cypress.Commands.add("co_NavegarCarritoCompras", () => {
  cy.get(Selector.ICONO_CARRITO)
    .as("btnCarrito")
    .should("exist")
    .and("be.visible");
  cy.get("@btnCarrito").click();
  cy.url().should("include", "/cart.html");
  cy.get(Selector.TITULOPRODUCTOS).should("contain", "Your Cart");
});

// Comando para obtener nombre y precio del producto con alias dinámico
Cypress.Commands.add("co_PrecioProducto", (aliasProducto, selectorPrecio) => {
  cy.get(selectorPrecio)
    .invoke("text")
    .then((texto) => {
      cy.wrap(texto.trim()).as(`${aliasProducto}Precio`);
    });
});

// Comando para comparar precio del producto en el carrito
Cypress.Commands.add("co_CompararPrecioProducto", (alias, selector) => {
  cy.get(alias).then((textoGuardado) => {
    cy.get(selector)
      .invoke("text")
      .then((textoActualProceso) => {
        expect(textoActualProceso.trim()).to.eq(textoGuardado.trim());
      });
  });
});

// Validar que los 3 productos están en el resumen
Cypress.Commands.add("co_ValidarProductosEnResumen", (cantidadEsperada) => {
  cy.get(".cart_item").should("have.length", cantidadEsperada);
});

// Comando para llenar el formulario de checkout
Cypress.Commands.add(
  "co_LlenarFormularioCheckout",
  (nombre, apellido, codigoPostal) => {
    cy.get(Selector.INPUT_NOMBRE).should("be.visible").type(nombre);
    cy.get(Selector.INPUT_APELLIDO).should("be.visible").type(apellido);
    cy.get(Selector.INPUT_CODIGO_POSTAL)
      .should("be.visible")
      .type(codigoPostal);
    cy.get(Selector.BOTON_CONTINUE).should("be.visible").click();
  }
);

// Comando para validar elementos del resumen de compra
Cypress.Commands.add("co_ValidarResumenCompra", () => {
  cy.get(Selector.TITULO_RESUMEN).should("contain", "Checkout: Overview");
  cy.get(Selector.SUBTOTAL_LABEL).should("be.visible");
  cy.get(Selector.TAX_LABEL).should("be.visible");
  cy.get(Selector.TOTAL_LABEL).should("be.visible");
  cy.get(Selector.INFO_PAGO).should("be.visible");
  cy.get(Selector.INFO_ENVIO).should("be.visible");
  cy.get(Selector.BOTON_FINISH).should("be.visible").and("contain", "Finish");
  cy.get(Selector.BOTON_CANCEL).should("be.visible").and("contain", "Cancel");
});

// Comando para calcular y validar el total
Cypress.Commands.add("co_ValidarTotalCompra", () => {
  let sumaPrecios = 0;

  // Obtener todos los precios de los productos en el resumen
  cy.get(Selector.LISTA_PRECIOS_RESUMEN)
    .each(($precio) => {
      const precioNumerico = parseFloat($precio.text().replace("$", ""));
      sumaPrecios += precioNumerico;
    })
    .then(() => {
      // Validar que el subtotal mostrado coincide con la suma
      cy.get(Selector.SUBTOTAL_LABEL)
        .invoke("text")
        .then((subtotalTexto) => {
          const subtotalMostrado = parseFloat(
            subtotalTexto.replace("Item total: $", "")
          );

          cy.log(`Suma calculada: $${sumaPrecios.toFixed(2)}`);
          cy.log(`Subtotal mostrado: $${subtotalMostrado.toFixed(2)}`);
          expect(subtotalMostrado).to.equal(parseFloat(sumaPrecios.toFixed(2)));
          // Guardar subtotal para usarlo después
          cy.wrap(subtotalMostrado).as("subtotalMostrado");
        });

      // Validar que el tax es mayor a 0
      cy.get(Selector.TAX_LABEL)
        .invoke("text")
        .then((taxTexto) => {
          const tax = parseFloat(taxTexto.replace("Tax: $", ""));
          expect(tax).to.be.greaterThan(0);
          cy.log(`Tax: $${tax.toFixed(2)}`);
          // Guardar tax para usarlo después
          cy.wrap(tax).as("tax");
        });
    });

  // Validar total = subtotal + tax
  cy.get("@subtotalMostrado").then((subtotalMostrado) => {
    cy.get("@tax").then((tax) => {
      cy.get(Selector.TOTAL_LABEL)
        .invoke("text")
        .then((totalTexto) => {
          const totalMostrado = parseFloat(totalTexto.replace("Total: $", ""));
          const totalCalculado = subtotalMostrado + tax;

          cy.log(`Total mostrado: $${totalMostrado.toFixed(2)}`);
          cy.log(`Total calculado: $${totalCalculado.toFixed(2)}`);

          expect(totalMostrado).to.equal(parseFloat(totalCalculado.toFixed(2)));
        });
    });
  });
});

// Comando personalizado para validar la confirmación final
Cypress.Commands.add("co_ValidarConfirmacionCompra", () => {
  cy.url().should("include", "/checkout-complete.html");
  cy.get(Selector.TITULO_COMPLETO).should("contain", "Checkout: Complete!");
  cy.get(Selector.MENSAJE_CONFIRMACION)
    .should("be.visible")
    .and("contain", "Thank you for your order!");
  cy.get(Selector.TEXTO_CONFIRMACION)
    .should("be.visible")
    .and("contain", "Your order has been dispatched");
  cy.get(Selector.IMAGEN_CONFIRMACION).should("be.visible");
  cy.get(Selector.BOTON_BACK_HOME)
    .should("be.visible")
    .and("contain", "Back Home");
});
