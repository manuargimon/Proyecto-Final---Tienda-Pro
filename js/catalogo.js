let productos = [];
let carrito = JSON.parse(localStorage.getItem("carrito")) ?? [];

const vistaCatalogo = document.getElementById("vistaCatalogo");
const vistaCarrito = document.getElementById("vistaCarrito");
const vistaCheckout = document.getElementById("vistaCheckout");

const contenedorCatalogo = document.getElementById("contenedorCatalogo");
const selectCategoria = document.getElementById("selectCategoria");
const btnCarrito = document.getElementById("btnCarrito");
const listaCarrito = document.getElementById("listaCarrito");
const totalCarrito = document.getElementById("totalCarrito");
const contadorCarrito = document.getElementById("contadorCarrito");
const btnSeguirComprando = document.getElementById("btnSeguirComprando");
const btnVaciarCarrito = document.getElementById("btnVaciarCarrito");
const btnFinalizarCompra = document.getElementById("btnFinalizarCompra");

function notificar(texto, color) {
  Toastify({
    text: texto,
    duration: 2500,
    close: true,
    gravity: "top",
    position: "right",
    style: { background: color }
  }).showToast();
}

function formatearPrecio(precio) {
  return precio.toLocaleString("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });
}

function guardarCarritoStorage() {
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

function mostrarVista(vista) {
  vistaCatalogo.classList.add("oculto");
  vistaCarrito.classList.add("oculto");
  vistaCheckout.classList.add("oculto");
  vista.classList.remove("oculto");
}

function renderCatalogo(lista) {
  contenedorCatalogo.innerHTML = lista.length === 0
    ? "<p class='text-center text-muted'>No hay productos en esta categoria</p>"
    : "";

  lista.forEach(producto => {
    const { id, nombre, precio, categoria, icono } = producto;

    const columna = document.createElement("div");
    columna.className = "col-sm-6 col-md-4 col-lg-3";
    columna.innerHTML = `
      <div class="card h-100 text-center">
        <img src="assets/icons/${icono}" alt="${nombre}" />
        <div class="card-body d-flex flex-column">
          <h3 class="h6">${nombre}</h3>
          <p class="text-muted small">${categoria}</p>
          <p class="fw-bold">${formatearPrecio(precio)}</p>
          <button class="btn btn-primary mt-auto btnAgregarCarrito" data-id="${id}">Agregar al carrito</button>
        </div>
      </div>
    `;
    contenedorCatalogo.appendChild(columna);
  });
}

function poblarCategorias() {
  const categorias = [...new Set(productos.map(p => p.categoria))];

  categorias.forEach(categoria => {
    const option = document.createElement("option");
    option.value = categoria;
    option.textContent = categoria;
    selectCategoria.appendChild(option);
  });
}

function renderCarrito() {
  listaCarrito.innerHTML = carrito.length === 0
    ? "<p class='text-center text-muted'>Tu carrito esta vacio</p>"
    : "";

  carrito.forEach(item => {
    const { id, nombre, precio, cantidad } = item;
    const subtotal = precio * cantidad;

    const fila = document.createElement("div");
    fila.className = "list-group-item d-flex justify-content-between align-items-center";
    fila.innerHTML = `
      <div>
        <p class="mb-0 fw-semibold">${nombre}</p>
        <p class="mb-0 text-muted small">${formatearPrecio(subtotal)}</p>
      </div>
      <div class="d-flex align-items-center gap-2">
        <button class="btn btn-sm btn-outline-secondary" data-accion="restar" data-id="${id}">-</button>
        <span>${cantidad}</span>
        <button class="btn btn-sm btn-outline-secondary" data-accion="sumar" data-id="${id}">+</button>
        <button class="btn btn-sm btn-danger" data-accion="eliminar" data-id="${id}">x</button>
      </div>
    `;
    listaCarrito.appendChild(fila);
  });

  const total = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
  totalCarrito.textContent = formatearPrecio(total);
  contadorCarrito.textContent = carrito.reduce((acc, item) => acc + item.cantidad, 0);
  btnFinalizarCompra.disabled = carrito.length === 0;
}

function agregarAlCarrito(idTexto) {
  const id = Number(idTexto);
  const productoExistente = carrito.find(item => item.id === id);

  productoExistente
    ? productoExistente.cantidad++
    : carrito.push({ ...productos.find(p => p.id === id), cantidad: 1 });

  guardarCarritoStorage();
  renderCarrito();
  notificar("Producto agregado al carrito", "#27ae60");
}

function modificarCantidad(idTexto, accion) {
  const id = Number(idTexto);
  const item = carrito.find(p => p.id === id);

  if (!item) return;

  accion === "sumar" ? item.cantidad++ : item.cantidad--;
  carrito = item.cantidad <= 0 ? carrito.filter(p => p.id !== id) : carrito;

  guardarCarritoStorage();
  renderCarrito();
}

function eliminarDelCarrito(idTexto) {
  const id = Number(idTexto);
  carrito = carrito.filter(p => p.id !== id);
  guardarCarritoStorage();
  renderCarrito();
}

function vaciarCarritoConfirmado() {
  carrito = [];
  guardarCarritoStorage();
  renderCarrito();
  notificar("Carrito vaciado", "#2980b9");
}

async function cargarProductos() {
  try {
    contenedorCatalogo.innerHTML = "<p class='text-center text-muted'>Cargando catalogo...</p>";

    const response = await fetch("./js/productos.json");

    if (!response.ok) {
      throw new Error(`No se pudo cargar el catalogo (error ${response.status})`);
    }

    productos = await response.json();
    poblarCategorias();
    renderCatalogo(productos);
    renderCarrito();
  } catch (error) {
    contenedorCatalogo.innerHTML = "<p class='text-center text-danger'>No pudimos cargar los productos. Intenta recargar la pagina.</p>";
    notificar(error.message, "#e74c3c");
  }
}

contenedorCatalogo.addEventListener("click", (event) => {
  const esBotonAgregar = event.target.classList.contains("btnAgregarCarrito");
  const id = event.target?.dataset?.id;

  esBotonAgregar && agregarAlCarrito(id);
});

listaCarrito.addEventListener("click", (event) => {
  const accion = event.target?.dataset?.accion;
  const id = event.target?.dataset?.id;

  accion === "eliminar" && eliminarDelCarrito(id);
  (accion === "sumar" || accion === "restar") && modificarCantidad(id, accion);
});

selectCategoria.addEventListener("change", () => {
  const categoriaElegida = selectCategoria.value;
  const filtrados = categoriaElegida === "todas" ? productos : productos.filter(p => p.categoria === categoriaElegida);
  renderCatalogo(filtrados);
});

btnCarrito.addEventListener("click", () => {
  mostrarVista(vistaCarrito);
});

btnSeguirComprando.addEventListener("click", () => {
  mostrarVista(vistaCatalogo);
});

btnVaciarCarrito.addEventListener("click", () => {
  Swal.fire({
    title: "Vaciar el carrito?",
    text: "Se van a quitar todos los productos",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Si, vaciar",
    cancelButtonText: "Cancelar"
  }).then((resultado) => {
    resultado.isConfirmed && vaciarCarritoConfirmado();
  });
});

cargarProductos();
