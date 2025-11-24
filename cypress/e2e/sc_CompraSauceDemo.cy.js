import * as Selector from "../support/selectores";

describe("Flujos de iniciar sesión con credenciales inválidas", () => {
  beforeEach(() => {
    const baseUrl = Cypress.config("baseUrl");
    cy.visit(baseUrl);
  });

  it("Inicio de sesión fallido", function () {
    // Usar comando para prevalidaciones
    cy.co_PreValidaciones();
    // Uso de fixture para cargar datos de usuario invalidos
    cy.fixture("fx_DatosIniciarSesion").then((usuario) => {
      cy.co_IniciarSesion(usuario.nombreUsuarioInv, usuario.claveInv);
    });
    // Validaciones: Mensaje de error y URL
    cy.get(Selector.MENSAJEERROR)
      .should("exist")
      .and("be.visible")
      .and(
        "contain.text",
        "Epic sadface: Username and password do not match any user in this service"
      );
    cy.get(Selector.CONTENEDOR_ERROR).should(
      "have.css",
      "background-color",
      "rgb(226, 35, 26)"
    );
    cy.url().should("include", "");
  });
});

describe("Flujos de iniciar sesión válidos", () => {
  beforeEach(() => {
    const baseUrl = Cypress.config("baseUrl");
    cy.visit(baseUrl);
    // Inicio de sesión con datos válidos
    cy.co_PreValidaciones();
    cy.fixture("fx_DatosIniciarSesion").then((usuario) => {
      cy.co_IniciarSesion(usuario.nombreUsuario, usuario.clave);
    });
    cy.co_ValidarInicioSesionExitosa();
  });

  it("Agregar productos al carrito de compras", () => {
    // Usar comando para seleccionar tres productos y agregarlos al carrito.
    cy.co_AdicionarProductos();
    // Usar comando para validar que al agregar productos cambie su estado después de hacer clic.
    cy.co_ValidarEstado();
  });

  it("Verificar el carrito de compras", () => {
    cy.co_AdicionarProductos();
    // Confirmar que el número de productos en el ícono del carrito es correcto.
    cy.get(Selector.ICONO_CARRITO).should("contain.text", "3");
    // Validar que los precios de los productos son visibles y correctos.
    // Usar comando para obtener nombre y precio de los productos pagina principal
    cy.co_PrecioProducto("mochila", Selector.PRECIO_PRODUCTO_MOCHILA);
    cy.co_PrecioProducto("chaqueta", Selector.PRECIO_PRODUCTO_CHAQUETA);
    cy.co_PrecioProducto("mameluco", Selector.PRECIO_PRODUCTO_MAMELUCO);
    // Usar comando de navegación al carrito de compras y validaciones
    cy.co_NavegarCarritoCompras();
    // Usar comando para validar que los precios en el carrito coincidan con los de la página principal
    cy.co_CompararPrecioProducto(
      "@mochilaPrecio",
      Selector.PRECIO_CARRITO_MOCHILA
    );
    cy.co_CompararPrecioProducto(
      "@chaquetaPrecio",
      Selector.PRECIO_CARRITO_CHAQUETA
    );
    cy.co_CompararPrecioProducto(
      "@mamelucoPrecio",
      Selector.PRECIO_CARRITO_MAMELUCO
    );
  });

  it("Completar el proceso de checkout exitosamente", () => {
    cy.co_AdicionarProductos();
    cy.co_NavegarCarritoCompras();
    // **Llenar los datos requeridos para el checkout**
    // Usar comando para validar que los 3 productos están en el resumen
    cy.co_ValidarProductosEnResumen(3);
    // Iniciar proceso de checkout y validar información pagina
    cy.get(Selector.BOTON_CHECKOUT)
      .as("btnCheckout")
      .should("be.visible")
      .and("contain", "Checkout");
    cy.get("@btnCheckout").click();
    cy.url().should("include", "/checkout-step-one.html");
    cy.get(Selector.TITULOPRODUCTOS).should(
      "contain",
      "Checkout: Your Information"
    );
    // Cargar y usar comando para llenar datos de checkout
    cy.fixture("fx_DatosCheckout").then((datosCheckout) => {
      cy.co_LlenarFormularioCheckout(
        datosCheckout.nombre,
        datosCheckout.apellido,
        datosCheckout.codigoPostal
      );
    });
    // Validar que estamos en la página de resumen
    cy.url().should("include", "/checkout-step-two.html");
    // Validar elementos del resumen de compra
    cy.co_ValidarResumenCompra();
    // Usar comando para validar que los 3 productos están en el resumen
    cy.co_ValidarProductosEnResumen(3);
    // Validar nombres de los 3 productos visibles en resumen
    cy.get(Selector.LISTA_PRODUCTOS_RESUMEN)
      .as("listaNomProductos")
      .should("have.length", 3);
    cy.get("@listaNomProductos").each(($nombre) => {
      cy.wrap($nombre).should("be.visible");
    });
    // Validar precios de los 3 productos sean visibles y mayores a 0
    cy.get(Selector.LISTA_PRECIOS_RESUMEN)
      .as("listaPreciosProductos")
      .should("have.length", 3);
    cy.get("@listaPreciosProductos").each(($precio) => {
      cy.wrap($precio).should("be.visible");
      const precio = parseFloat($precio.text().replace("$", ""));
      expect(precio).to.be.greaterThan(0);
    });
    // Usar comando para validar el cálculo del total
    cy.co_ValidarTotalCompra();
    // Finalizar la compra
    cy.get(Selector.BOTON_FINISH).should("exist").and("be.visible");
    cy.get(Selector.BOTON_FINISH).click();
    // **Continuar proceso y mostrar el mensaje: "Thank you for your order!"**
    cy.co_ValidarConfirmacionCompra();
  });
});
