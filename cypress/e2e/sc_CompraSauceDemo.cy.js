import * as Selector from "../support/selectores";

describe("Flujos de iniciar sesión válidos", () => {
  
  beforeEach(() => {
    const baseUrl = Cypress.config("baseUrl");
    cy.visit(baseUrl);
    // Usar comando para prevalidaciones e inicio de sesión con datos válidos
    cy.co_PreValidaciones();
    // Uso de fixture para cargar datos de usuario e iniciar sesión
    cy.fixture("fx_DatosIniciarSesion").then((usuario) => {
      cy.co_IniciarSesion(usuario.nombreUsuario, usuario.clave);
    });
  });

  it("Validaciones de inicio de sesión exitosa", () => {
    cy.url().should("include", "/inventory.html");
    cy.get(Selector.TITULOPRODUCTOS).should("exist").and("be.visible");
    cy.get(Selector.ICONO_CARRITO).should("exist").and("be.visible");
  });

  it("Agregar productos al carrito de compras", () => {
    // Usar comando para adicionar productos y validar su estado
    cy.co_AdicionarProductos_ValidarEstado();
    // Usar comando para obtener nombre y precio de los productos pagina principal
    cy.co_NombrePrecioProducto("mochila", Selector.NOMBRE_PRODUCTO_MOCHILA, Selector.PRECIO_PRODUCTO_MOCHILA);
    cy.co_NombrePrecioProducto("chaqueta", Selector.NOMBRE_PRODUCTO_CHAQUETA, Selector.PRECIO_PRODUCTO_CHAQUETA);
    cy.co_NombrePrecioProducto("mameluco", Selector.NOMBRE_PRODUCTO_MAMELUCO, Selector.PRECIO_PRODUCTO_MAMELUCO);
    // Usar comando de navegación al carrito de compras
    cy.co_NavegarCarritoCompras();
    // Usar comando para validar que los nombres y precios en el carrito coincidan con los de la página principal
    cy.co_CompararTextoProducto("@mochilaNombre", Selector.NOMBRE_CARRITO_MOCHILA);
    cy.co_CompararTextoProducto("@mochilaPrecio", Selector.PRECIO_CARRITO_MOCHILA);
    cy.co_CompararTextoProducto("@chaquetaNombre", Selector.NOMBRE_CARRITO_CHAQUETA);
    cy.co_CompararTextoProducto("@chaquetaPrecio", Selector.PRECIO_CARRITO_CHAQUETA);
    cy.co_CompararTextoProducto("@mamelucoNombre", Selector.NOMBRE_CARRITO_MAMELUCO);
    cy.co_CompararTextoProducto("@mamelucoPrecio", Selector.PRECIO_CARRITO_MAMELUCO);
  });

  it("Completar el proceso de checkout exitosamente", () => {
    // Usar comando para adicionar productos, validar su estado y navegar al carrito
    cy.co_AdicionarProductos_ValidarEstado();
    cy.co_NavegarCarritoCompras();
    // Usar comando para validar que los 3 productos están en el resumen
    cy.co_ValidarProductosEnResumen(3);
     // Iniciar proceso de checkout y validar información pagina
    cy.get(Selector.BOTON_CHECKOUT).should("be.visible").and("contain", "Checkout").click();
    cy.url().should("include", "/checkout-step-one.html");
    cy.get(Selector.TITULOPRODUCTOS).should("contain","Checkout: Your Information");
    // Cargar y usar comando para llenar datos de checkout 
    cy.fixture("fx_DatosCheckout").then((datosCheckout) => {
      cy.co_LlenarFormularioCheckout(datosCheckout.nombre, datosCheckout.apellido, datosCheckout.codigoPostal);
    });
    // Validar que estamos en la página de resumen
    cy.url().should("include", "/checkout-step-two.html");
    // Validar elementos del resumen de compra
    cy.co_ValidarResumenCompra();
    // Usar comando para validar que los 3 productos están en el resumen
    cy.co_ValidarProductosEnResumen(3);
    // Validar nombres de productos visibles en resumen
    cy.wait(5000); 
    cy.get('[data-test="inventory-item-name"]').should("have.length", 3); // Asegurarse de que hay 3 nombres
    cy.get('[data-test="inventory-item-name"]').each(($nombre) => { // Iterar sobre cada nombre
      cy.wrap($nombre).should("be.visible"); // Validar visibilidad
    });
    // Validar precios visibles en resumen
    cy.wait(5000); 
    cy.get('[data-test="inventory-item-price"]').should("have.length", 3); // Asegurarse de que hay 3 precios
    cy.get('[data-test="inventory-item-price"]').each(($precio) => { // Iterar sobre cada precio
      cy.wrap($precio).should("be.visible"); // Validar visibilidad
      const precio = parseFloat($precio.text().replace("$", "")); // Convertir a número
      expect(precio).to.be.greaterThan(0);// Validar que el precio es mayor que 0
    });
    // Validar cálculo del total
    cy.co_ValidarTotalCompra();
    // Finalizar la compra
    cy.get(Selector.BOTON_FINISH).click();
    // Validar confirmación de compra exitosa
    cy.co_ValidarConfirmacionCompra();
   });
});

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
    cy.get(Selector.MENSAJEERROR).should("exist").and("be.visible").and("contain.text", "Epic sadface: Username and password do not match any user in this service");
    cy.get(Selector.CONTENEDOR_ERROR).should("have.css", "background-color", "rgb(226, 35, 26)");
    cy.url().should("include", "");
  });
});
