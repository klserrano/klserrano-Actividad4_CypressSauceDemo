Fundamentos de Pruebas

Actividad 4: Pruebas end-to-end para el sitio web https://www.saucedemo.com.

Integrantes del equipo 3:
Lizeth Rosso Villegas
Karen Lorena Serrano García
Ever Peña Ballesteros

Pasos para la ejecución de las pruebas

1. Instalar Node.js (Solo si no lo tiene):

   - Verificar si se encuentra instalado:
     En la terminal / CMD ejecute lo siguiente:
     node -v
     npm -v

     Si visualiza alguna versión, ya lo tiene instalado.

Si no lo tiene instalado, puede descargarlo en: https://nodejs.org versión LTS.

2.  Crear una carpeta para su proyecto

    Elija un lugar en el pc y cree una carpeta con este nombre:
    saucedemo-testing

    También puede crearla desde la terminal con estos comandos:

    mkdir saucedemo-testing
    cd saucedemo-testing

3.  Inicializar el proyecto npm

    Dentro de la carpeta creada saucedemo-testing, ejecutar:
    npm init -y

    Allí se creará un archivo package.json.

4.  Instalar Cypress

    Ejecutar el siguiente comando:
    npm install cypress --save-dev

    Esto permite descargar Cypress dentro del proyecto.

5.  Abrir Cypress por primera vez

    Ejecutar el siguiente comando:
    npx cypress open

    La primera vez, Cypress creará automáticamente una estructura como esta:

    cypress/
    ─ e2e/
    ─ fixtures/
    ─ support/
    ─ commands.js/
    cypress.config.js/
    package.json/

    Se debe abrir Cypress una vez para que genere estas carpetas.

6.  Actualizar el archivo cypress.config.js

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

7.  Crear fixtures con datos del usuario y el checkout

    7.1 Crear el fixture de inicio de sesión:
    En la capeta Fixtures, se debe crear el archivo fx_DatosIniciarSesion.json con los siguientes datos:

        {
            "nombreUsuario": "standard_user",
            "clave": "secret_sauce",
            "nombreUsuarioInv": "standard",
            "claveInv": "123"
        }

    7.2 Crear el fixture de checkout:
    En la capeta Fixtures, se debe crear el archivo fx_DatosCheckout.json con los siguientes datos:

        {
            "nombre": "Juan",
            "apellido": "Pérez",
            "codigoPostal": "110111"
        }

8.  Crear comandos personalizados Cypress

En la capeta support, se debe actualizar el archivo commands.js con los siguientes datos:

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
    cy.get(Selector.INFO_PAGO)
        .contains("Payment Information")
        .should("be.visible");
    cy.get(Selector.INFO_ENVIO)
        .contains("Shipping Information")
        .should("be.visible");
    cy.get(Selector.BOTON_FINISH)
        .should("be.visible")
        .and("contain", "Finish")
        .and("exist");
    cy.get(Selector.BOTON_CANCEL)
        .should("be.visible")
        .and("contain", "Cancel")
        .and("exist");
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
            .should("be.visible")
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

9. Crear selectores

En la capeta support, se debe crear el archivo selectores.js con los siguientes datos:

    // Selectores para la pantalla de Iniciar Sesion
    export const NOMBREUSUARIO = "#user-name";
    export const CLAVE = "#password";
    export const BOTON_INGRESAR = "#login-button";
    export const TITULOPRODUCTOS = '[data-test="title"]';
    export const MENSAJEERROR = '[data-test="error"]';
    export const LOGO = ".login_logo";
    export const CONTENEDOR_NEGRO = ".login_credentials_wrap-inner";
    export const CONTENEDOR_ERROR = ".login-box .error-message-container.error";
    export const CREDENCIALES_USUARIOS = "#login_credentials";
    export const CREDENCIALES_CLAVES = '[data-test="login-password"]';
    export const ICONO_CARRITO = '[data-test="shopping-cart-link"]';

    //Selectores para la pantalla de Compra
    export const BOTON_AGREGAR_MOCHILA = "#add-to-cart-sauce-labs-backpack";
    export const BOTON_REMOVER_MOCHILA = "#remove-sauce-labs-backpack";
    export const BOTON_AGREGAR_MAMELUCO = "#add-to-cart-sauce-labs-onesie";
    export const BOTON_REMOVER_MAMELUCO = "#remove-sauce-labs-onesie";
    export const BOTON_AGREGAR_CHAQUETA = "#add-to-cart-sauce-labs-fleece-jacket";
    export const BOTON_REMOVER_CHAQUETA = "#remove-sauce-labs-fleece-jacket";
    export const BOTON_AGREGAR_TSHIRT = "#add-to-cart-sauce-labs-bolt-t-shirt";
    export const BOTON_REMOVER_TSHIRT = "#remove-sauce-labs-bolt-t-shirt";
    export const NOMBRE_PRODUCTO_MOCHILA = '.inventory_item:has(#remove-sauce-labs-backpack) [data-test="inventory-item-name"]';
    export const PRECIO_PRODUCTO_MOCHILA = '[data-test="inventory-item-price"]:has(+ #remove-sauce-labs-backpack)';
    export const NOMBRE_PRODUCTO_MAMELUCO = '.inventory_item:has(#remove-sauce-labs-onesie) [data-test="inventory-item-name"]';
    export const PRECIO_PRODUCTO_MAMELUCO = '[data-test="inventory-item-price"]:has(+ #remove-sauce-labs-onesie)';
    export const NOMBRE_PRODUCTO_CHAQUETA = '.inventory_item:has(#remove-sauce-labs-fleece-jacket) [data-test="inventory-item-name"]';
    export const PRECIO_PRODUCTO_CHAQUETA = '[data-test="inventory-item-price"]:has(+ #remove-sauce-labs-fleece-jacket)';
    export const NOMBRE_CARRITO_MOCHILA = '.cart_item_label:has(#remove-sauce-labs-backpack) [data-test="inventory-item-name"';
    export const PRECIO_CARRITO_MOCHILA = '.cart_item_label:has(#remove-sauce-labs-backpack) [data-test="inventory-item-price"]';
    export const NOMBRE_CARRITO_MAMELUCO = '.cart_item_label:has(#remove-sauce-labs-onesie) [data-test="inventory-item-name"';
    export const PRECIO_CARRITO_MAMELUCO = '.cart_item_label:has(#remove-sauce-labs-onesie) [data-test="inventory-item-price"]';
    export const NOMBRE_CARRITO_CHAQUETA = '.cart_item_label:has(#remove-sauce-labs-fleece-jacket) [data-test="inventory-item-name"';
    export const PRECIO_CARRITO_CHAQUETA = '.cart_item_label:has(#remove-sauce-labs-fleece-jacket) [data-test="inventory-item-price"]';

    // Selectores para la pantalla de Carrito
    export const BOTON_CHECKOUT = '[data-test="checkout"]';
    export const BOTON_CONTINUE_SHOPPING = '[data-test="continue-shopping"]';

    // Selectores para la pantalla de Información del Checkout
    export const INPUT_NOMBRE = '[data-test="firstName"]';
    export const INPUT_APELLIDO = '[data-test="lastName"]';
    export const INPUT_CODIGO_POSTAL = '[data-test="postalCode"]';
    export const BOTON_CONTINUE = '[data-test="continue"]';
    export const BOTON_CANCEL = '[data-test="cancel"]';

    // Selectores para la pantalla de Resumen del Checkout
    export const TITULO_RESUMEN = '[data-test="title"]';
    export const SUBTOTAL_LABEL = '[data-test="subtotal-label"]';
    export const TAX_LABEL = '[data-test="tax-label"]';
    export const TOTAL_LABEL = '[data-test="total-label"]';
    export const BOTON_FINISH = '[data-test="finish"]';
    export const INFO_PAGO = '[data-test="payment-info-label"]';
    export const INFO_ENVIO = '[data-test="shipping-info-label"]';
    export const LISTA_PRODUCTOS_RESUMEN = '[data-test="inventory-item-name"]';
    export const LISTA_PRECIOS_RESUMEN = '[data-test="inventory-item-price"]';

    // Selectores para la pantalla de Confirmación
    export const TITULO_COMPLETO = '[data-test="title"]';
    export const MENSAJE_CONFIRMACION = '[data-test="complete-header"]';
    export const TEXTO_CONFIRMACION = '[data-test="complete-text"]';
    export const IMAGEN_CONFIRMACION = '[data-test="pony-express"]';
    export const BOTON_BACK_HOME = '[data-test="back-to-products"]';

10. Crear el archivo del Test E2E

En la capeta e2e, se debe crear el archivo sc_CompraSauceDemo.cy.js segun el script adjunto

11. Ejecutar el test
    Se puede ejecutar a través de las siguientes opciones: - Ejecutar el comando: npx cypress open
    Seleccionar: E2E Testing / browser / sc_CompraSauceDemo.spec.js.

        - Ejecutar el comando: npx cypress run

Observaciones adicionales:
    Evita errores comunes como que tu carpeta de user se llame users en los fixtures
