describe('SauceDemo - Flujo Completo de Compra E2E', () => {
  
  // Variables para almacenar información de los productos
  let productosSeleccionados = [];
  let precioTotal = 0;

  beforeEach(() => {
    cy.visit('https://www.saucedemo.com');
  });

  it('Debe completar el flujo de compra con todas las validaciones requeridas', () => {
    
    // ========================================
    // 1. INICIO DE SESIÓN
    // ========================================
    cy.log('**PASO 1: Inicio de Sesión**');
    
    // Ingresar credenciales
    cy.get('[data-test="username"]')
      .should('be.visible')
      .type('standard_user');
    
    cy.get('[data-test="password"]')
      .should('be.visible')
      .type('secret_sauce');
    
    // Click en login
    cy.get('[data-test="login-button"]')
      .should('be.visible')
      .click();
    
    // Verificar que el login fue exitoso
    cy.url().should('include', '/inventory.html');
    cy.get('.title').should('contain', 'Products');
    
    // ========================================
    // 2. AGREGAR PRODUCTOS AL CARRITO
    // ========================================
    cy.log('**PASO 2: Agregar 3 Productos al Carrito**');
    
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
    
    // Guardar precio del producto 1
    cy.get('[data-test="inventory-item-price"]').first()
      .invoke('text')
      .then((precio) => {
        productosSeleccionados.push({
          nombre: 'Sauce Labs Backpack',
          precio: parseFloat(precio.replace('$', ''))
        });
      });
    
    // Producto 2: Sauce Labs Bike Light
    cy.get('[data-test="item-0-title-link"]')
      .should('be.visible')
      .and('contain', 'Sauce Labs Bike Light');
    
    cy.get('[data-test="add-to-cart-sauce-labs-bike-light"]')
      .should('be.visible')
      .and('contain', 'Add to cart')
      .click();
    
    // Validar que el botón cambió su estado
    cy.get('[data-test="remove-sauce-labs-bike-light"]')
      .should('be.visible')
      .and('contain', 'Remove');
    
    // Producto 3: Sauce Labs Bolt T-Shirt
    cy.get('[data-test="item-1-title-link"]')
      .should('be.visible')
      .and('contain', 'Sauce Labs Bolt T-Shirt');
    
    cy.get('[data-test="add-to-cart-sauce-labs-bolt-t-shirt"]')
      .should('be.visible')
      .and('contain', 'Add to cart')
      .click();
    
    // Validar que el botón cambió su estado
    cy.get('[data-test="remove-sauce-labs-bolt-t-shirt"]')
      .should('be.visible')
      .and('contain', 'Remove');
    
    // Verificar que el badge del carrito muestre 3 items
    cy.get('.shopping_cart_badge')
      .should('be.visible')
      .and('contain', '3');
    
    // ========================================
    // 3. VERIFICAR EL CARRITO DE COMPRAS
    // ========================================
    cy.log('**PASO 3: Verificar el Carrito de Compras**');
    
    // Ir al carrito
    cy.get('.shopping_cart_link')
      .should('be.visible')
      .click();
    
    cy.url().should('include', '/cart.html');
    cy.get('.title').should('contain', 'Your Cart');
    
    // Verificar que hay exactamente 3 productos en el carrito
    cy.get('.cart_item').should('have.length', 3);
    
    // Confirmar que el número en el ícono del carrito es correcto
    cy.get('.shopping_cart_badge')
      .should('be.visible')
      .and('contain', '3');
    
    // Validar que los nombres de los productos son visibles
    cy.get('.inventory_item_name').should('have.length', 3);
    cy.get('.inventory_item_name').each(($el) => {
      cy.wrap($el).should('be.visible');
    });
    
    // Validar que los precios son visibles y correctos
    cy.get('.inventory_item_price').should('have.length', 3);
    
    let sumaPreciosCarrito = 0;
    
    cy.get('.inventory_item_price').each(($precio) => {
      // Verificar visibilidad
      cy.wrap($precio).should('be.visible');
      
      // Extraer y sumar precios
      const precioTexto = $precio.text();
      const precioNumerico = parseFloat(precioTexto.replace('$', ''));
      
      // Validar que el precio es un número válido
      expect(precioNumerico).to.be.a('number');
      expect(precioNumerico).to.be.greaterThan(0);
      
      sumaPreciosCarrito += precioNumerico;
    }).then(() => {
      cy.log(`Suma de precios en carrito: $${sumaPreciosCarrito.toFixed(2)}`);
      precioTotal = sumaPreciosCarrito;
    });
    
    // Validar que cada producto tiene cantidad visible
    cy.get('.cart_quantity').should('have.length', 3);
    cy.get('.cart_quantity').each(($cantidad) => {
      cy.wrap($cantidad).should('be.visible').and('contain', '1');
    });
    
    // ========================================
    // 4. COMPLETAR EL PROCESO DE CHECKOUT
    // ========================================
    cy.log('**PASO 4: Proceso de Checkout**');
    
    // Click en Checkout
    cy.get('[data-test="checkout"]')
      .should('be.visible')
      .and('contain', 'Checkout')
      .click();
    
    cy.url().should('include', '/checkout-step-one.html');
    cy.get('.title').should('contain', 'Checkout: Your Information');
    
    // Llenar datos requeridos
    cy.get('[data-test="firstName"]')
      .should('be.visible')
      .type('Juan');
    
    cy.get('[data-test="lastName"]')
      .should('be.visible')
      .type('Pérez');
    
    cy.get('[data-test="postalCode"]')
      .should('be.visible')
      .type('110111');
    
    // Continuar al siguiente paso
    cy.get('[data-test="continue"]')
      .should('be.visible')
      .and('contain', 'Continue')
      .click();
    
    // ========================================
    // 5. VALIDACIONES ADICIONALES - RESUMEN
    // ========================================
    cy.log('**PASO 5: Validaciones en Resumen de Compra**');
    
    cy.url().should('include', '/checkout-step-two.html');
    cy.get('.title').should('contain', 'Checkout: Overview');
    
    // Verificar que los productos siguen en el resumen
    cy.get('.cart_item').should('have.length', 3);
    
    // Verificar nombres de productos visibles
    cy.get('.inventory_item_name').should('have.length', 3);
    cy.get('.inventory_item_name').each(($nombre) => {
      cy.wrap($nombre).should('be.visible');
    });
    
    // Verificar precios visibles en el resumen
    cy.get('.inventory_item_price').should('have.length', 3);
    cy.get('.inventory_item_price').each(($precio) => {
      cy.wrap($precio).should('be.visible');
    });
    
    // Calcular y verificar el subtotal
    let sumaSubtotal = 0;
    cy.get('.inventory_item_price').each(($precio) => {
      const precioNumerico = parseFloat($precio.text().replace('$', ''));
      sumaSubtotal += precioNumerico;
    });
    
    // Verificar el Item Total
    cy.get('.summary_subtotal_label').should('be.visible').invoke('text').then((subtotalTexto) => {
      const subtotalMostrado = parseFloat(subtotalTexto.replace('Item total: $', ''));
      cy.log(`Subtotal esperado: $${precioTotal.toFixed(2)}`);
      cy.log(`Subtotal mostrado: $${subtotalMostrado.toFixed(2)}`);
      
      // Validar que el subtotal corresponde a la suma de productos
      expect(subtotalMostrado).to.equal(parseFloat(precioTotal.toFixed(2)));
    });
    
    // Verificar que el Tax es visible
    cy.get('.summary_tax_label').should('be.visible').invoke('text').then((taxTexto) => {
      const tax = parseFloat(taxTexto.replace('Tax: $', ''));
      expect(tax).to.be.greaterThan(0);
      cy.log(`Impuesto (Tax): $${tax.toFixed(2)}`);
    });
    
    // Verificar el Total (Subtotal + Tax)
    cy.get('.summary_total_label').should('be.visible').invoke('text').then((totalTexto) => {
      const totalMostrado = parseFloat(totalTexto.replace('Total: $', ''));
      cy.log(`Total final: $${totalMostrado.toFixed(2)}`);
      
      // Validar que el total es mayor al subtotal (incluye impuestos)
      expect(totalMostrado).to.be.greaterThan(precioTotal);
    });
    
    // Verificar información de pago y envío
    cy.get('.summary_info_label').contains('Payment Information').should('be.visible');
    cy.get('.summary_info_label').contains('Shipping Information').should('be.visible');
    
    // Verificar botón de Finish
    cy.get('[data-test="finish"]')
      .should('be.visible')
      .and('contain', 'Finish');
    
    // Verificar botón de Cancel
    cy.get('[data-test="cancel"]')
      .should('be.visible')
      .and('contain', 'Cancel');
    
    // Finalizar compra
    cy.get('[data-test="finish"]').click();
    
    // ========================================
    // 6. VERIFICACIÓN FINAL
    // ========================================
    cy.log('**PASO 6: Verificación del Mensaje Final**');
    
    cy.url().should('include', '/checkout-complete.html');
    cy.get('.title').should('contain', 'Checkout: Complete!');
    
    // Verificar el mensaje de agradecimiento exacto
    cy.get('.complete-header')
      .should('be.visible')
      .and('contain', 'Thank you for your order!');
    
    // Verificar el texto descriptivo
    cy.get('.complete-text')
      .should('be.visible')
      .and('contain', 'Your order has been dispatched');
    
    // Verificar la imagen de confirmación
    cy.get('.pony_express')
      .should('be.visible')
      .and('have.attr', 'src');
    
    // Verificar botón para volver
    cy.get('[data-test="back-to-products"]')
      .should('be.visible')
      .and('contain', 'Back Home');
    
    cy.log('**✓ PRUEBA COMPLETADA EXITOSAMENTE**');
  });

});