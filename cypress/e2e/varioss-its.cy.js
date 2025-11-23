describe('SauceDemo - Flujo Completo de Compra E2E', () => {

  it('Debe agregar tres productos y validar cambio de estado', () => {
    cy.loginToSauceDemo();
    
    // Producto 1
    cy.get('[data-test="add-to-cart-sauce-labs-backpack"]')
      .should('contain', 'Add to cart')
      .click();
    cy.get('[data-test="remove-sauce-labs-backpack"]')
      .should('contain', 'Remove');
    
    // Producto 2
    cy.get('[data-test="add-to-cart-sauce-labs-bike-light"]')
      .should('contain', 'Add to cart')
      .click();
    cy.get('[data-test="remove-sauce-labs-bike-light"]')
      .should('contain', 'Remove');
    
    // Producto 3
    cy.get('[data-test="add-to-cart-sauce-labs-bolt-t-shirt"]')
      .should('contain', 'Add to cart')
      .click();
    cy.get('[data-test="remove-sauce-labs-bolt-t-shirt"]')
      .should('contain', 'Remove');
    
    cy.get('.shopping_cart_badge').should('contain', '3');
  });

  it('Debe verificar correctamente el carrito', () => {
    cy.loginToSauceDemo();
    
    cy.get('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    cy.get('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
    cy.get('[data-test="add-to-cart-sauce-labs-bolt-t-shirt"]').click();
    
    cy.get('.shopping_cart_link').click();
    cy.get('.cart_item').should('have.length', 3);
    cy.get('.shopping_cart_badge').should('contain', '3');
    
    cy.get('.inventory_item_price').each(($precio) => {
      cy.wrap($precio).should('be.visible');
      const precio = parseFloat($precio.text().replace('$', ''));
      expect(precio).to.be.greaterThan(0);
    });
  });

  it('Debe completar el proceso de checkout', () => {
    cy.loginToSauceDemo();
    
    cy.get('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    cy.get('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
    cy.get('[data-test="add-to-cart-sauce-labs-bolt-t-shirt"]').click();
    
    cy.get('.shopping_cart_link').click();
    cy.get('[data-test="checkout"]').click();
    
    cy.get('[data-test="firstName"]').type('Juan');
    cy.get('[data-test="lastName"]').type('Pérez');
    cy.get('[data-test="postalCode"]').type('110111');
    cy.get('[data-test="continue"]').click();
    
    cy.url().should('include', '/checkout-step-two.html');
  });

  it('Debe validar precios y total en el resumen', () => {
    cy.loginToSauceDemo();
    
    cy.get('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    cy.get('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
    cy.get('[data-test="add-to-cart-sauce-labs-bolt-t-shirt"]').click();
    
    cy.get('.shopping_cart_link').click();
    cy.get('[data-test="checkout"]').click();
    cy.get('[data-test="firstName"]').type('Juan');
    cy.get('[data-test="lastName"]').type('Pérez');
    cy.get('[data-test="postalCode"]').type('110111');
    cy.get('[data-test="continue"]').click();
    
    let suma = 0;
    cy.get('.inventory_item_price').each(($precio) => {
      suma += parseFloat($precio.text().replace('$', ''));
    }).then(() => {
      cy.get('.summary_subtotal_label').invoke('text').then((texto) => {
        const subtotal = parseFloat(texto.replace('Item total: $', ''));
        expect(subtotal).to.equal(parseFloat(suma.toFixed(2)));
      });
    });
  });

  it('Debe mostrar mensaje de confirmación al finalizar', () => {
    cy.loginToSauceDemo();
    
    cy.get('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    cy.get('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
    cy.get('[data-test="add-to-cart-sauce-labs-bolt-t-shirt"]').click();
    
    cy.get('.shopping_cart_link').click();
    cy.get('[data-test="checkout"]').click();
    cy.get('[data-test="firstName"]').type('Juan');
    cy.get('[data-test="lastName"]').type('Pérez');
    cy.get('[data-test="postalCode"]').type('110111');
    cy.get('[data-test="continue"]').click();
    cy.get('[data-test="finish"]').click();
    
    cy.get('.complete-header')
      .should('contain', 'Thank you for your order!');
  });

});