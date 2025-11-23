describe('SauceDemo - Flujo Completo de Compra E2E', () => {
  const login = () => {
    cy.session('userSession', () => {
      cy.visit('');
      cy.get('[data-test="username"]').type('standard_user');
      cy.get('[data-test="password"]').type('secret_sauce');
      cy.get('[data-test="login-button"]').click();
      cy.url().should('include', 'inventory.html');
    }, {
      validate() {
        // Validar que la sesión sigue activa
        cy.getCookie('session-username').should('exist');
      }
    });
  };

  beforeEach(() => {
    login(); // Usa la sesión cacheada
    cy.visit('inventory.html');
  });

  // ========================================
  // TEST 1: INICIO DE SESIÓN
  // ========================================
  it('Debe permitir el inicio de sesión con credenciales válidas', () => {
    cy.log('**Inicio de Sesión**');
    
    // Verificar que los campos sean visibles
    cy.get('[data-test="username"]').should('be.visible').type('standard_user');
    cy.get('[data-test="password"]').should('be.visible').type('secret_sauce');
    cy.get('[data-test="login-button"]').should('be.visible').click();
    
    // Verificar que el login fue exitoso
    cy.url().should('include', '/inventory.html');
    cy.get('.title').should('contain', 'Products');
    cy.get('.inventory_list').should('be.visible');
  });

  // ========================================
  // TEST 2: AGREGAR PRODUCTOS
  // ========================================
  it('Debe agregar tres productos al carrito y validar cambio de estado de botones', () => {
    cy.log('**Agregar Productos al Carrito**');
    
    // Login primero
    cy.get('[data-test="username"]').type('standard_user');
    cy.get('[data-test="password"]').type('secret_sauce');
    cy.get('[data-test="login-button"]').click();
    cy.url().should('include', '/inventory.html');
    
    // Producto 1: Sauce Labs Backpack
    cy.get('[data-test="item-4-title-link"]')
      .should('be.visible')
      .and('contain', 'Sauce Labs Backpack');
    
    cy.get('[data-test="add-to-cart-sauce-labs-backpack"]')
      .should('be.visible')
      .and('contain', 'Add to cart')
      .click();
    
    // Validar que el botón cambió su estado
    cy.get('[data-test="remove-sauce-labs-backpack"]')
      .should('be.visible')
      .and('contain', 'Remove');
    
    // Verificar badge del carrito
    cy.get('.shopping_cart_badge').should('contain', '1');
    
    // Producto 2: Sauce Labs Bike Light
    cy.get('[data-test="item-0-title-link"]')
      .should('be.visible')
      .and('contain', 'Sauce Labs Bike Light');
    
    cy.get('[data-test="add-to-cart-sauce-labs-bike-light"]')
      .should('be.visible')
      .and('contain', 'Add to cart')
      .click();
    
    // Validar cambio de estado
    cy.get('[data-test="remove-sauce-labs-bike-light"]')
      .should('be.visible')
      .and('contain', 'Remove');
    
    cy.get('.shopping_cart_badge').should('contain', '2');
    
    // Producto 3: Sauce Labs Bolt T-Shirt
    cy.get('[data-test="item-1-title-link"]')
      .should('be.visible')
      .and('contain', 'Sauce Labs Bolt T-Shirt');
    
    cy.get('[data-test="add-to-cart-sauce-labs-bolt-t-shirt"]')
      .should('be.visible')
      .and('contain', 'Add to cart')
      .click();
    
    // Validar cambio de estado
    cy.get('[data-test="remove-sauce-labs-bolt-t-shirt"]')
      .should('be.visible')
      .and('contain', 'Remove');
    
    // Verificar que el badge muestre 3 items
    cy.get('.shopping_cart_badge')
      .should('be.visible')
      .and('contain', '3');
  });

  // ========================================
  // TEST 3: VERIFICAR CARRITO
  // ========================================
  it('Debe mostrar correctamente los productos, precios y cantidad en el carrito', () => {
    cy.log('**Verificar Carrito de Compras**');
    
    // Login y agregar productos
    cy.get('[data-test="username"]').type('standard_user');
    cy.get('[data-test="password"]').type('secret_sauce');
    cy.get('[data-test="login-button"]').click();
    
    cy.get('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    cy.get('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
    cy.get('[data-test="add-to-cart-sauce-labs-bolt-t-shirt"]').click();
    
    // Ir al carrito
    cy.get('.shopping_cart_link').should('be.visible').click();
    cy.url().should('include', '/cart.html');
    cy.get('.title').should('contain', 'Your Cart');
    
    // Verificar cantidad de productos
    cy.get('.cart_item').should('have.length', 3);
    
    // Confirmar número en el ícono del carrito
    cy.get('.shopping_cart_badge')
      .should('be.visible')
      .and('contain', '3');
    
    // Validar nombres de productos visibles
    cy.get('.inventory_item_name').should('have.length', 3);
    cy.get('.inventory_item_name').each(($el) => {
      cy.wrap($el).should('be.visible');
    });
    
    // Validar que los precios son visibles y correctos
    cy.get('.inventory_item_price').should('have.length', 3);
    cy.get('.inventory_item_price').each(($precio) => {
      cy.wrap($precio).should('be.visible');
      
      const precioTexto = $precio.text();
      const precioNumerico = parseFloat(precioTexto.replace('$', ''));
      
      // Validar que el precio es un número válido y positivo
      expect(precioNumerico).to.be.a('number');
      expect(precioNumerico).to.be.greaterThan(0);
    });
    
    // Validar cantidades
    cy.get('.cart_quantity').should('have.length', 3);
    cy.get('.cart_quantity').each(($cantidad) => {
      cy.wrap($cantidad).should('be.visible').and('contain', '1');
    });
  });

  // ========================================
  // TEST 4: PROCESO DE CHECKOUT
  // ========================================
  it('Debe completar el formulario de checkout exitosamente', () => {
    cy.log('**Proceso de Checkout**');
    
    // Preparación: Login y agregar productos
    cy.get('[data-test="username"]').type('standard_user');
    cy.get('[data-test="password"]').type('secret_sauce');
    cy.get('[data-test="login-button"]').click();
    
    cy.get('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    cy.get('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
    cy.get('[data-test="add-to-cart-sauce-labs-bolt-t-shirt"]').click();
    
    // Ir al carrito y checkout
    cy.get('.shopping_cart_link').click();
    cy.get('[data-test="checkout"]')
      .should('be.visible')
      .and('contain', 'Checkout')
      .click();
    
    cy.url().should('include', '/checkout-step-one.html');
    cy.get('.title').should('contain', 'Checkout: Your Information');
    
    // Llenar formulario
    cy.get('[data-test="firstName"]').should('be.visible').type('Juan');
    cy.get('[data-test="lastName"]').should('be.visible').type('Pérez');
    cy.get('[data-test="postalCode"]').should('be.visible').type('110111');
    
    // Continuar
    cy.get('[data-test="continue"]')
      .should('be.visible')
      .and('contain', 'Continue')
      .click();
    
    // Verificar que llegamos al resumen
    cy.url().should('include', '/checkout-step-two.html');
    cy.get('.title').should('contain', 'Checkout: Overview');
  });

  // ========================================
  // TEST 5: VALIDACIONES DEL RESUMEN
  // ========================================
  it('Debe validar correctamente los precios y el total en el resumen de compra', () => {
    cy.log('**Validar Resumen de Compra**');
    
    // Preparación: Login, agregar productos y llegar al resumen
    cy.get('[data-test="username"]').type('standard_user');
    cy.get('[data-test="password"]').type('secret_sauce');
    cy.get('[data-test="login-button"]').click();
    
    cy.get('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    cy.get('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
    cy.get('[data-test="add-to-cart-sauce-labs-bolt-t-shirt"]').click();
    
    cy.get('.shopping_cart_link').click();
    cy.get('[data-test="checkout"]').click();
    
    cy.get('[data-test="firstName"]').type('Juan');
    cy.get('[data-test="lastName"]').type('Pérez');
    cy.get('[data-test="postalCode"]').type('110111');
    cy.get('[data-test="continue"]').click();
    
    // Validaciones del resumen
    cy.url().should('include', '/checkout-step-two.html');
    
    // Verificar productos en el resumen
    cy.get('.cart_item').should('have.length', 3);
    
    // Verificar nombres y precios visibles
    cy.get('.inventory_item_name').should('have.length', 3);
    cy.get('.inventory_item_name').each(($nombre) => {
      cy.wrap($nombre).should('be.visible');
    });
    
    cy.get('.inventory_item_price').should('have.length', 3);
    cy.get('.inventory_item_price').each(($precio) => {
      cy.wrap($precio).should('be.visible');
    });
    
    // Calcular suma de precios
    let sumaPrecios = 0;
    cy.get('.inventory_item_price').each(($precio) => {
      const precioNumerico = parseFloat($precio.text().replace('$', ''));
      sumaPrecios += precioNumerico;
    }).then(() => {
      // Verificar subtotal
      cy.get('.summary_subtotal_label')
        .should('be.visible')
        .invoke('text')
        .then((subtotalTexto) => {
          const subtotalMostrado = parseFloat(subtotalTexto.replace('Item total: $', ''));
          cy.log(`Suma calculada: $${sumaPrecios.toFixed(2)}`);
          cy.log(`Subtotal mostrado: $${subtotalMostrado.toFixed(2)}`);
          
          // Validar que coinciden
          expect(subtotalMostrado).to.equal(parseFloat(sumaPrecios.toFixed(2)));
        });
    });
    
    // Verificar Tax
    cy.get('.summary_tax_label')
      .should('be.visible')
      .invoke('text')
      .then((taxTexto) => {
        const tax = parseFloat(taxTexto.replace('Tax: $', ''));
        expect(tax).to.be.greaterThan(0);
      });
    
    // Verificar Total
    cy.get('.summary_total_label').should('be.visible');
    
    // Verificar información adicional
    cy.get('.summary_info_label').contains('Payment Information').should('be.visible');
    cy.get('.summary_info_label').contains('Shipping Information').should('be.visible');
    
    // Verificar botones
    cy.get('[data-test="finish"]').should('be.visible').and('contain', 'Finish');
    cy.get('[data-test="cancel"]').should('be.visible').and('contain', 'Cancel');
  });

  // ========================================
  // TEST 6: FINALIZAR COMPRA
  // ========================================
  it('Debe mostrar el mensaje "Thank you for your order!" al finalizar la compra', () => {
    cy.log('**Finalizar Compra**');
    
    // Flujo completo hasta finalizar
    cy.get('[data-test="username"]').type('standard_user');
    cy.get('[data-test="password"]').type('secret_sauce');
    cy.get('[data-test="login-button"]').click();
    
    cy.get('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    cy.get('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
    cy.get('[data-test="add-to-cart-sauce-labs-bolt-t-shirt"]').click();
    
    cy.get('.shopping_cart_link').click();
    cy.get('[data-test="checkout"]').click();
    
    cy.get('[data-test="firstName"]').type('Juan');
    cy.get('[data-test="lastName"]').type('Pérez');
    cy.get('[data-test="postalCode"]').type('110111');
    cy.get('[data-test="continue"]').click();
    
    // Finalizar compra
    cy.get('[data-test="finish"]').click();
    
    // Verificaciones finales
    cy.url().should('include', '/checkout-complete.html');
    cy.get('.title').should('contain', 'Checkout: Complete!');
    
    // Verificar mensaje exacto
    cy.get('.complete-header')
      .should('be.visible')
      .and('contain', 'Thank you for your order!');
    
    cy.get('.complete-text')
      .should('be.visible')
      .and('contain', 'Your order has been dispatched');
    
    // Verificar imagen de confirmación
    cy.get('.pony_express')
      .should('be.visible')
      .and('have.attr', 'src');
    
    // Verificar botón de regreso
    cy.get('[data-test="back-to-products"]')
      .should('be.visible')
      .and('contain', 'Back Home');
  });

});