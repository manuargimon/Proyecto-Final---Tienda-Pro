const resumenCheckout = document.getElementById("resumenCheckout");
const formCheckout = document.getElementById("formCheckout");
const selectMedioPago = document.getElementById("selectMedioPago");
const camposTarjeta = document.getElementById("camposTarjeta");
const inputNombreCheckout = document.getElementById("inputNombreCheckout");
const inputEmailCheckout = document.getElementById("inputEmailCheckout");
const btnVolverCarrito = document.getElementById("btnVolverCarrito");
const btnConfirmarCompra = document.getElementById("btnConfirmarCompra");

function renderResumenCheckout() {
  const filas = carrito
    .map(item => `<p>${item.nombre} x${item.cantidad} - ${formatearPrecio(item.precio * item.cantidad)}</p>`)
    .join("");

  const total = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

  resumenCheckout.innerHTML = `${filas}<p class="fw-bold border-top pt-2 mt-2 mb-0">Total a pagar: ${formatearPrecio(total)}</p>`;
}

function mostrarCheckout() {
  renderResumenCheckout();
  mostrarVista(vistaCheckout);
}

function simularProcesoPago() {
  return new Promise((resolve) => {
    setTimeout(resolve, 1500);
  });
}

async function confirmarCompra(event) {
  event.preventDefault();

  try {
    btnConfirmarCompra.disabled = true;

    const nombre = inputNombreCheckout.value.trim();
    const email = inputEmailCheckout.value.trim();

    if (nombre === "" || email === "") {
      throw new Error("Completa tus datos antes de confirmar la compra");
    }

    await simularProcesoPago();

    carrito = [];
    guardarCarritoStorage();
    renderCarrito();
    mostrarVista(vistaCatalogo);

    Swal.fire({
      title: "Compra confirmada",
      text: `Gracias ${nombre}! Te enviamos la confirmacion a ${email}`,
      icon: "success",
      confirmButtonText: "Genial"
    });
  } catch (error) {
    notificar(error.message, "#e74c3c");
  } finally {
    btnConfirmarCompra.disabled = false;
  }
}

selectMedioPago.addEventListener("change", () => {
  const esTarjeta = selectMedioPago.value === "tarjeta";
  camposTarjeta.classList.toggle("oculto", !esTarjeta);
});

btnFinalizarCompra.addEventListener("click", mostrarCheckout);
btnVolverCarrito.addEventListener("click", () => mostrarVista(vistaCarrito));
formCheckout.addEventListener("submit", confirmarCompra);
