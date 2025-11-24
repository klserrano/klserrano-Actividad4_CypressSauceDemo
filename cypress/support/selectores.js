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