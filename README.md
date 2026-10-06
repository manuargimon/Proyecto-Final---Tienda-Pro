# TiendaJS - Proyecto Final

Este es mi proyecto final del curso de JavaScript. Es un simulador de una tienda online: se puede ver el catalogo de productos, agregarlos a un carrito, y completar todo el circuito de compra hasta la confirmacion final.

## Guia de uso

1. Al entrar se ve el catalogo de productos, traido desde `data/productos.json`.
2. Se puede filtrar por categoria con el selector de arriba.
3. Tocando "Agregar al carrito" en cualquier producto, se suma al carrito (el boton de arriba a la derecha muestra cuantos items hay).
4. Tocando el boton "Carrito" se pasa a la seccion del carrito, donde se puede sumar/restar cantidad de cada producto, eliminarlo, vaciar todo el carrito (pide confirmacion), o volver a seguir comprando.
5. Con productos en el carrito, el boton "Finalizar compra" lleva a la pantalla de checkout, con el formulario de datos y de pago ya completado (no hace falta escribir nada para probarlo).
6. Al tocar "Confirmar compra", se simula un proceso de pago, se vacia el carrito, y aparece un mensaje de agradecimiento. Despues de eso la app queda lista para hacer otra compra.

No hace falta registrarse ni loguearse para nada, y todos los campos del checkout ya vienen con datos de prueba cargados.

## Como probarlo

Como el catalogo se trae con `fetch` desde un archivo local, hay que abrirlo con un servidor, no con doble clic. Yo lo probe con la extension **Live Server** de VS Code (click derecho en `index.html` > "Open with Live Server").

## Como esta armado

- `index.html`: la estructura de la pagina, con tres secciones (catalogo, carrito, checkout) que se muestran una a la vez. No tiene nada de JS adentro, todo el comportamiento esta en los archivos de `js/`.
- `css/style.css`: ajustes propios arriba de Bootstrap (el grueso del estilado lo pone Bootstrap).
- `js/catalogo.js`: trae los productos con `fetch`, arma el catalogo dinamicamente, maneja el filtro por categoria y toda la logica del carrito (agregar, sumar/restar cantidad, eliminar, vaciar, guardar en `localStorage`).
- `js/main.js`: maneja la pantalla de checkout: arma el resumen de la compra, valida los datos del formulario, simula el proceso de pago con `async/await` y confirma la compra.
- `js/productos.json`: el catalogo de productos (hace de "base de datos").
- `assets/icons/`: un icono por categoria de producto.

## Cosas que usé

- Bootstrap (via CDN) para el estilado general: navbar, grilla de cards, formularios y botones
- `fetch` con `async/await` y `try/catch/finally` para traer el catalogo y validar el checkout
- DOM dinamico: todo el HTML de productos y del carrito se genera con JavaScript (template strings), nada esta escrito a mano en el HTML
- `localStorage` para que el carrito no se pierda si se recarga la pagina a mitad de una compra
- Toastify para los avisos cortos (producto agregado, carrito vaciado, errores)
- SweetAlert2 para la confirmacion de "vaciar carrito" y el mensaje final de compra confirmada (reemplazando `confirm()` y `alert()`)
- `map`, `filter`, `find`, `reduce` para manejar el array de productos y el carrito
- Ternario, `&&`, `??`, `?.` y destructuring en varios lugares del codigo
- `Intl` (via `toLocaleString`) para mostrar los precios con formato de moneda argentina

## Pendiente / a mejorar

- Guardar un historial de compras anteriores, no solo el carrito actual
- Agregar busqueda de productos por nombre, ademas del filtro por categoria
# Proyecto-Final---Tienda-Pro
