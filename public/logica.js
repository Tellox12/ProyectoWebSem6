const CLAVES = {
    productos: 'pickup_productos',
    carrito: 'carrito',
    pedidos: 'pickup_pedidos',
    admin: 'pickup_admin_activo',
    token: 'pickup_admin_token',
};

const ADMIN_EMAIL = 'admin@pickupexpress.com';
const ADMIN_PASSWORD = 'admin123';
const API_BASE = '/api';

const CATEGORIAS = {
    bebidas: 'Bebidas',
    comidas: 'Comidas',
    postres: 'Postres',
    snacks: 'Snacks',
};

const ESTADOS_PEDIDO = {
    pendiente: { texto: 'Pendiente', clase: 'bg-secondary' },
    preparando: { texto: 'Preparando', clase: 'bg-warning text-dark' },
    listo: { texto: 'Listo', clase: 'bg-info text-dark' },
    entregado: { texto: 'Entregado', clase: 'bg-success' },
    cancelado: { texto: 'Cancelado', clase: 'bg-danger' },
};

const PRODUCTOS_INICIALES = [
    {
        id: 'cafe-americano',
        nombre: 'Cafe Americano',
        categoria: 'bebidas',
        descripcion: 'Cafe expreso con agua caliente',
        precio: 3.5,
        img: 'img/cafe.jpg',
        activo: true,
    },
    {
        id: 'cappuccino',
        nombre: 'Cappuccino',
        categoria: 'bebidas',
        descripcion: 'Cafe expreso con espuma de leche',
        precio: 4.5,
        img: 'img/cappuccino.jpg',
        activo: true,
    },
    {
        id: 'te-verde',
        nombre: 'Te Verde',
        categoria: 'bebidas',
        descripcion: 'Te verde natural',
        precio: 3,
        img: 'img/te.jpeg',
        activo: true,
    },
    {
        id: 'jugo-de-naranja',
        nombre: 'Jugo de Naranja',
        categoria: 'bebidas',
        descripcion: 'Jugo natural de naranja recien exprimido',
        precio: 4,
        img: 'img/jugo.jpg',
        activo: true,
    },
    {
        id: 'hamburguesa-artesanal',
        nombre: 'Hamburguesa Artesanal',
        categoria: 'comidas',
        descripcion: 'Hamburguesa con carne, lechuga, tomate y pan rustico',
        precio: 8.5,
        img: 'img/hamburguesa.jpg',
        activo: true,
    },
    {
        id: 'tacos-variados',
        nombre: 'Tacos Variados',
        categoria: 'comidas',
        descripcion: 'Orden de tacos con salsas frescas y limon',
        precio: 7,
        img: 'img/tacos.jpg',
        activo: true,
    },
    {
        id: 'ensalada-de-pollo',
        nombre: 'Ensalada de Pollo',
        categoria: 'comidas',
        descripcion: 'Ensalada fresca con pollo, hojas verdes y granada',
        precio: 6.5,
        img: 'img/ensalada-pollo.jpg',
        activo: true,
    },
    {
        id: 'wrap-vegetariano',
        nombre: 'Wrap Vegetariano',
        categoria: 'comidas',
        descripcion: 'Wrap con vegetales frescos, lechuga y tomate',
        precio: 6,
        img: 'img/wrap-vegetariano.jpg',
        activo: true,
    },
];

let filtroMenuActual = 'todos';
let filtroProductosAdmin = 'todos';
let filtroPedidosAdmin = 'todos';

function leerJSON(clave, respaldo) {
    try {
        const valor = localStorage.getItem(clave);
        return valor === null ? respaldo : JSON.parse(valor);
    } catch (error) {
        return respaldo;
    }
}

function guardarJSON(clave, valor) {
    localStorage.setItem(clave, JSON.stringify(valor));
}

async function apiRequest(ruta, opciones = {}) {
    const headers = {
        Accept: 'application/json',
        ...(opciones.headers || {}),
    };

    if (!(opciones.body instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
    }

    const token = localStorage.getItem(CLAVES.token);
    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const respuesta = await fetch(`${API_BASE}${ruta}`, {
        ...opciones,
        headers,
        body: opciones.body && !(opciones.body instanceof FormData)
            ? JSON.stringify(opciones.body)
            : opciones.body,
    });

    const texto = await respuesta.text();
    let datos = null;

    try {
        datos = texto ? JSON.parse(texto) : null;
    } catch (error) {
        datos = null;
    }

    if (!respuesta.ok) {
        const mensaje = datos?.message || 'No se pudo completar la solicitud.';
        throw new Error(mensaje);
    }

    return datos;
}

function escaparHTML(valor) {
    const temporal = document.createElement('div');
    temporal.textContent = valor ?? '';
    return temporal.innerHTML;
}

function formatoMoneda(valor) {
    return `$${Number(valor || 0).toFixed(2)}`;
}

function crearIdProducto(nombre) {
    const base = String(nombre || 'producto')
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

    return `${base || 'producto'}-${Date.now().toString(36)}`;
}

function normalizarProducto(producto, indice = 0) {
    const nombre = String(producto?.nombre || `Producto ${indice + 1}`).trim();
    const categoria = Object.keys(CATEGORIAS).includes(producto?.categoria)
        ? producto.categoria
        : 'bebidas';

    return {
        id: producto?.id || crearIdProducto(nombre),
        nombre,
        categoria,
        descripcion: String(producto?.descripcion || '').trim(),
        precio: Math.max(0, Number(producto?.precio) || 0),
        img: String(producto?.img || 'img/cafe.jpg').trim(),
        activo: producto?.activo !== false,
    };
}

function productoDesdeApi(producto, indice = 0) {
    return normalizarProducto({
        id: String(producto?.id || producto?.id_producto || crearIdProducto(producto?.nombre)),
        nombre: producto?.nombre,
        categoria: producto?.categoria,
        descripcion: producto?.descripcion,
        precio: producto?.precio,
        img: producto?.img,
        activo: producto?.activo,
    }, indice);
}

function productoParaApi(producto) {
    return {
        nombre: producto.nombre,
        categoria: producto.categoria,
        descripcion: producto.descripcion,
        precio: Number(producto.precio),
        img: producto.img,
        activo: Boolean(producto.activo),
    };
}

function obtenerProductos() {
    if (localStorage.getItem(CLAVES.productos) === null) {
        guardarJSON(CLAVES.productos, PRODUCTOS_INICIALES);
    }

    const productos = leerJSON(CLAVES.productos, PRODUCTOS_INICIALES);
    if (!Array.isArray(productos)) {
        guardarJSON(CLAVES.productos, PRODUCTOS_INICIALES);
        return [...PRODUCTOS_INICIALES];
    }

    const normalizados = productos.map(normalizarProducto);
    const existentes = new Set(normalizados.map((producto) => producto.id));

    PRODUCTOS_INICIALES.forEach((producto) => {
        if (!existentes.has(producto.id)) {
            normalizados.push(normalizarProducto(producto));
        }
    });

    if (normalizados.length !== productos.length) {
        guardarProductos(normalizados);
    }

    return normalizados;
}

function guardarProductos(productos) {
    guardarJSON(CLAVES.productos, productos.map(normalizarProducto));
}

async function obtenerProductosRemotos() {
    try {
        const productos = await apiRequest('/productos');

        if (Array.isArray(productos) && productos.length > 0) {
            const normalizados = productos.map(productoDesdeApi);
            guardarProductos(normalizados);
            return normalizados;
        }
    } catch (error) {
        console.warn(error.message);
    }

    return obtenerProductos();
}

function obtenerCarrito() {
    const carrito = leerJSON(CLAVES.carrito, []);
    if (!Array.isArray(carrito)) return [];

    return carrito
        .filter((item) => item && item.id && item.nombre)
        .map((item) => ({
            id: item.id,
            nombre: item.nombre,
            precio: Math.max(0, Number(item.precio) || 0),
            img: item.img || 'img/cafe.jpg',
            cantidad: Math.max(1, Number.parseInt(item.cantidad, 10) || 1),
        }));
}

function guardarCarrito(carrito) {
    guardarJSON(CLAVES.carrito, carrito);
}

function obtenerPedidos() {
    const pedidos = leerJSON(CLAVES.pedidos, []);
    if (!Array.isArray(pedidos)) return [];

    return pedidos.map((pedido) => ({
        id: pedido.id,
        fecha: pedido.fecha || new Date().toISOString(),
        cliente: pedido.cliente || {},
        hora: pedido.hora || '',
        notas: pedido.notas || '',
        items: Array.isArray(pedido.items) ? pedido.items : [],
        total: Number(pedido.total) || 0,
        estado: ESTADOS_PEDIDO[pedido.estado] ? pedido.estado : 'pendiente',
    }));
}

function guardarPedidos(pedidos) {
    guardarJSON(CLAVES.pedidos, pedidos);
}

function pedidoDesdeApi(pedido) {
    return {
        id: pedido.numero || String(pedido.id),
        dbId: pedido.id,
        fecha: pedido.created_at || pedido.fecha || new Date().toISOString(),
        cliente: {
            nombre: pedido.nombre,
            telefono: pedido.telefono,
            correo: pedido.correo || '',
        },
        hora: pedido.hora || '',
        notas: pedido.notas || '',
        items: Array.isArray(pedido.items) ? pedido.items : [],
        total: Number(pedido.total) || 0,
        estado: pedido.estado || 'pendiente',
    };
}

function pedidoParaApi(pedido) {
    return {
        numero: pedido.id,
        nombre: pedido.cliente.nombre,
        telefono: pedido.cliente.telefono,
        correo: pedido.cliente.correo || '',
        hora: pedido.hora,
        notas: pedido.notas,
        items: pedido.items,
        total: Number(pedido.total),
        estado: pedido.estado,
    };
}

async function obtenerPedidosRemotos() {
    try {
        const pedidos = await apiRequest('/pedidos');

        if (Array.isArray(pedidos) && pedidos.length > 0) {
            const normalizados = pedidos.map(pedidoDesdeApi);
            guardarPedidos(normalizados);
            return normalizados;
        }
    } catch (error) {
        console.warn(error.message);
    }

    return obtenerPedidos();
}

async function obtenerPedidoRemoto(numeroPedido) {
    try {
        const pedido = await apiRequest(`/pedidos/${encodeURIComponent(numeroPedido)}`);
        return pedido ? pedidoDesdeApi(pedido) : null;
    } catch (error) {
        console.warn(error.message);
        return null;
    }
}

function totalItemsCarrito() {
    return obtenerCarrito().reduce((total, item) => total + item.cantidad, 0);
}

function totalCarrito(carrito = obtenerCarrito()) {
    return carrito.reduce((total, item) => total + item.precio * item.cantidad, 0);
}

function actualizarContadores() {
    const total = totalItemsCarrito();
    const contadores = document.querySelectorAll('#contador-carrito, #nav-counter, [data-cart-counter]');

    contadores.forEach((contador) => {
        contador.textContent = total;
        contador.classList.toggle('d-none', total === 0);
    });
}

function mostrarAviso(mensaje, tipo = 'success') {
    let contenedor = document.getElementById('avisos-app');

    if (!contenedor) {
        contenedor = document.createElement('div');
        contenedor.id = 'avisos-app';
        contenedor.className = 'avisos-app';
        document.body.appendChild(contenedor);
    }

    const alerta = document.createElement('div');
    alerta.className = `alert alert-${tipo} shadow-sm aviso-item`;
    alerta.textContent = mensaje;
    contenedor.appendChild(alerta);

    window.setTimeout(() => {
        alerta.remove();
    }, 2600);
}

function plantillaProductoMenu(producto) {
    return `
        <article class="col-12 col-md-6 col-lg-3 producto" data-categoria="${producto.categoria}">
            <div class="tarjeta card h-100 shadow-sm border-0">
                <img src="${escaparHTML(producto.img)}" class="card-img-top img-producto" alt="${escaparHTML(producto.nombre)}">
                <div class="card-body d-flex flex-column">
                    <div class="d-flex justify-content-between align-items-start gap-2">
                        <h3 class="card-title h6 fw-bold mb-1">${escaparHTML(producto.nombre)}</h3>
                        <span class="badge bg-light text-secondary border">${CATEGORIAS[producto.categoria]}</span>
                    </div>
                    <p class="card-text text-muted small mb-3">${escaparHTML(producto.descripcion)}</p>
                    <div class="mt-auto d-flex justify-content-between align-items-center">
                        <span class="texto-naranja fw-bold">${formatoMoneda(producto.precio)}</span>
                        <button class="btn btn-naranja btn-sm btn-agregar" type="button" data-product-id="${producto.id}" title="Agregar al carrito">
                            <i class="bi bi-plus-lg"></i>
                        </button>
                    </div>
                </div>
            </div>
        </article>
    `;
}

async function renderizarMenu() {
    const contenedor = document.getElementById('listaProductosMenu');
    if (!contenedor) return;

    const productos = (await obtenerProductosRemotos()).filter((producto) => producto.activo);
    const productosVisibles = productos.filter((producto) => (
        filtroMenuActual === 'todos' || producto.categoria === filtroMenuActual
    ));

    if (productosVisibles.length === 0) {
        contenedor.innerHTML = `
            <div class="col-12">
                <div class="empty-state bg-white border text-center">
                    <i class="bi bi-box-seam text-secondary"></i>
                    <p class="text-muted mb-0">No hay productos en esta categoria.</p>
                </div>
            </div>
        `;
        return;
    }

    contenedor.innerHTML = productosVisibles.map(plantillaProductoMenu).join('');
}

function agregarAlCarrito(productoId) {
    const producto = obtenerProductos().find((item) => item.id === productoId && item.activo);
    if (!producto) {
        mostrarAviso('El producto ya no esta disponible.', 'warning');
        return;
    }

    const carrito = obtenerCarrito();
    const existente = carrito.find((item) => item.id === producto.id);

    if (existente) {
        existente.cantidad += 1;
        existente.nombre = producto.nombre;
        existente.precio = producto.precio;
        existente.img = producto.img;
    } else {
        carrito.push({
            id: producto.id,
            nombre: producto.nombre,
            precio: producto.precio,
            img: producto.img,
            cantidad: 1,
        });
    }

    guardarCarrito(carrito);
    actualizarContadores();
    mostrarAviso(`${producto.nombre} agregado al carrito.`);
}

function configurarMenu() {
    const contenedor = document.getElementById('listaProductosMenu');

    if (contenedor) {
        void renderizarMenu();
        contenedor.addEventListener('click', (evento) => {
            const boton = evento.target.closest('.btn-agregar');
            if (boton) agregarAlCarrito(boton.dataset.productId);
        });
    }

    document.querySelectorAll('.btn-filtro').forEach((boton) => {
        boton.addEventListener('click', () => {
            filtroMenuActual = boton.dataset.categoria || 'todos';

            document.querySelectorAll('.btn-filtro').forEach((item) => {
                item.classList.remove('btn-naranja');
                item.classList.add('btn-outline-secondary', 'bg-white');
            });

            boton.classList.remove('btn-outline-secondary', 'bg-white');
            boton.classList.add('btn-naranja');
            void renderizarMenu();
        });
    });
}

function plantillaItemCarrito(item, indice) {
    const subtotal = item.precio * item.cantidad;

    return `
        <div class="card cart-card p-3">
            <div class="d-flex align-items-center gap-3">
                <img src="${escaparHTML(item.img)}" class="product-img" alt="${escaparHTML(item.nombre)}">
                <div class="flex-grow-1">
                    <h3 class="h6 mb-1 fw-bold">${escaparHTML(item.nombre)}</h3>
                    <small class="text-muted">${formatoMoneda(item.precio)} c/u</small>
                    <div class="quantity-control mt-2" aria-label="Cantidad">
                        <button class="btn-qty" type="button" data-cart-action="decrease" data-index="${indice}" aria-label="Restar">-</button>
                        <span class="mx-2 fw-bold">${item.cantidad}</span>
                        <button class="btn-qty" type="button" data-cart-action="increase" data-index="${indice}" aria-label="Sumar">+</button>
                    </div>
                </div>
                <div class="text-end">
                    <div class="fw-bold mb-3">${formatoMoneda(subtotal)}</div>
                    <button class="btn btn-link text-danger p-0" type="button" data-cart-action="remove" data-index="${indice}" title="Eliminar">
                        <i class="bi bi-trash3 fs-5"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
}

function renderizarCarrito() {
    const contenedor = document.getElementById('contenedor-items');
    if (!contenedor) return;

    const carrito = obtenerCarrito();
    const total = totalCarrito(carrito);
    const totalTexto = document.getElementById('total-final');
    const subtotalTexto = document.getElementById('cart-subtotal');
    const botonCheckout = document.getElementById('btn-checkout');
    const botonVaciar = document.getElementById('btn-vaciar-carrito');

    if (carrito.length === 0) {
        contenedor.innerHTML = `
            <div class="empty-state bg-white border text-center">
                <i class="bi bi-cart3 text-secondary"></i>
                <p class="text-muted mb-0">No has seleccionado productos.</p>
            </div>
        `;
    } else {
        contenedor.innerHTML = carrito.map(plantillaItemCarrito).join('');
    }

    if (subtotalTexto) subtotalTexto.textContent = formatoMoneda(total);
    if (totalTexto) totalTexto.textContent = formatoMoneda(total);

    if (botonCheckout) {
        botonCheckout.classList.toggle('disabled', carrito.length === 0);
        botonCheckout.setAttribute('aria-disabled', carrito.length === 0 ? 'true' : 'false');
    }

    if (botonVaciar) {
        botonVaciar.disabled = carrito.length === 0;
    }

    actualizarContadores();
}

function cambiarCantidadCarrito(indice, cambio) {
    const carrito = obtenerCarrito();
    if (!carrito[indice]) return;

    carrito[indice].cantidad += cambio;

    if (carrito[indice].cantidad <= 0) {
        carrito.splice(indice, 1);
    }

    guardarCarrito(carrito);
    renderizarCarrito();
}

function eliminarItemCarrito(indice) {
    const carrito = obtenerCarrito();
    carrito.splice(indice, 1);
    guardarCarrito(carrito);
    renderizarCarrito();
}

function configurarCarrito() {
    const contenedor = document.getElementById('contenedor-items');
    if (!contenedor) return;

    contenedor.addEventListener('click', (evento) => {
        const boton = evento.target.closest('[data-cart-action]');
        if (!boton) return;

        const indice = Number.parseInt(boton.dataset.index, 10);
        const accion = boton.dataset.cartAction;

        if (accion === 'increase') cambiarCantidadCarrito(indice, 1);
        if (accion === 'decrease') cambiarCantidadCarrito(indice, -1);
        if (accion === 'remove') eliminarItemCarrito(indice);
    });

    const botonVaciar = document.getElementById('btn-vaciar-carrito');
    if (botonVaciar) {
        botonVaciar.addEventListener('click', () => {
            guardarCarrito([]);
            renderizarCarrito();
        });
    }

    renderizarCarrito();
}

function renderizarResumenCheckout() {
    const lista = document.getElementById('resumen-items-lista');
    if (!lista) return;

    const carrito = obtenerCarrito();
    const total = totalCarrito(carrito);
    const totalTexto = document.getElementById('checkout-total');
    const botonConfirmar = document.getElementById('btnConfirmarPedido');

    if (carrito.length === 0) {
        lista.innerHTML = '<p class="text-muted mb-0">Tu carrito esta vacio.</p>';
    } else {
        lista.innerHTML = carrito.map((item) => `
            <div class="d-flex justify-content-between resumen-item">
                <span>${item.cantidad}x ${escaparHTML(item.nombre)}</span>
                <span class="fw-bold text-dark">${formatoMoneda(item.precio * item.cantidad)}</span>
            </div>
        `).join('');
    }

    if (totalTexto) totalTexto.textContent = formatoMoneda(total);
    if (botonConfirmar) botonConfirmar.disabled = carrito.length === 0;
    actualizarContadores();
}

function generarNumeroPedido() {
    const fecha = new Date();
    const compacta = [
        fecha.getFullYear(),
        String(fecha.getMonth() + 1).padStart(2, '0'),
        String(fecha.getDate()).padStart(2, '0'),
    ].join('');
    const aleatorio = Math.random().toString(36).slice(2, 6).toUpperCase();

    return `ORD-${compacta}-${aleatorio}`;
}

async function procesarCheckout(evento) {
    evento.preventDefault();

    const formulario = evento.currentTarget;
    const carrito = obtenerCarrito();
    const mensaje = document.getElementById('checkoutMensaje');

    if (carrito.length === 0) {
        mostrarAviso('Agrega productos antes de confirmar el pedido.', 'warning');
        return;
    }

    if (!formulario.checkValidity()) {
        formulario.classList.add('was-validated');
        return;
    }

    const datos = new FormData(formulario);
    let pedido = {
        id: generarNumeroPedido(),
        fecha: new Date().toISOString(),
        cliente: {
            nombre: String(datos.get('nombre') || '').trim(),
            telefono: String(datos.get('telefono') || '').trim(),
            correo: String(datos.get('correo') || '').trim(),
        },
        hora: String(datos.get('hora') || '').trim(),
        notas: String(datos.get('notas') || '').trim(),
        items: carrito,
        total: totalCarrito(carrito),
        estado: 'pendiente',
    };

    try {
        const pedidoGuardado = await apiRequest('/pedidos', {
            method: 'POST',
            body: pedidoParaApi(pedido),
        });

        if (pedidoGuardado) {
            pedido = pedidoDesdeApi(pedidoGuardado);
        }
    } catch (error) {
        console.warn(error.message);
        mostrarAviso('El pedido se guardo localmente porque la API no respondio.', 'warning');
    }

    const pedidos = obtenerPedidos();
    pedidos.unshift(pedido);
    guardarPedidos(pedidos);
    guardarCarrito([]);

    formulario.reset();
    formulario.classList.remove('was-validated');
    renderizarResumenCheckout();
    actualizarContadores();

    if (mensaje) {
        mensaje.innerHTML = `
            <div class="alert alert-success mb-0">
                <strong>Pedido confirmado.</strong>
                <div>Numero: <span class="fw-bold">${pedido.id}</span></div>
                <a class="alert-link" href="seguimiento.html?pedido=${encodeURIComponent(pedido.id)}">Seguir pedido</a>
            </div>
        `;
        mensaje.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

function configurarCheckout() {
    const formulario = document.getElementById('formCheckout');
    if (!formulario) return;

    formulario.addEventListener('submit', procesarCheckout);
    renderizarResumenCheckout();
}

function obtenerClaseEstado(estado) {
    return ESTADOS_PEDIDO[estado]?.clase || ESTADOS_PEDIDO.pendiente.clase;
}

function obtenerTextoEstado(estado) {
    return ESTADOS_PEDIDO[estado]?.texto || ESTADOS_PEDIDO.pendiente.texto;
}

function plantillaDetallePedido(pedido) {
    const items = pedido.items.map((item) => `
        <li class="d-flex justify-content-between gap-3">
            <span>${item.cantidad}x ${escaparHTML(item.nombre)}</span>
            <span class="fw-semibold">${formatoMoneda(item.precio * item.cantidad)}</span>
        </li>
    `).join('');

    return `
        <div class="card border-0 shadow-sm rounded-3 p-4">
            <div class="d-flex flex-wrap justify-content-between gap-3 mb-3">
                <div>
                    <h3 class="h5 fw-bold mb-1">Pedido ${escaparHTML(pedido.id)}</h3>
                    <p class="text-muted small mb-0">${new Date(pedido.fecha).toLocaleString()}</p>
                </div>
                <span class="badge ${obtenerClaseEstado(pedido.estado)} align-self-start">${obtenerTextoEstado(pedido.estado)}</span>
            </div>
            <p class="mb-1"><strong>Cliente:</strong> ${escaparHTML(pedido.cliente.nombre || 'Sin nombre')}</p>
            <p class="mb-3"><strong>Hora de recoleccion:</strong> ${escaparHTML(pedido.hora || 'Sin hora')}</p>
            <ul class="list-unstyled border-top pt-3 mb-3">${items}</ul>
            <div class="d-flex justify-content-between h5 mb-0">
                <span>Total</span>
                <span class="texto-naranja">${formatoMoneda(pedido.total)}</span>
            </div>
        </div>
    `;
}

async function buscarPedidoPorNumero() {
    const inputPedido = document.getElementById('numeroPedido');
    const resultadoPedido = document.getElementById('resultadoPedido');
    if (!inputPedido || !resultadoPedido) return;

    const numeroPedido = inputPedido.value.trim().toUpperCase();

    if (!numeroPedido) {
        resultadoPedido.innerHTML = '<div class="alert alert-warning">Ingresa un numero de pedido.</div>';
        return;
    }

    const pedido = await obtenerPedidoRemoto(numeroPedido)
        || obtenerPedidos().find((item) => item.id.toUpperCase() === numeroPedido);

    if (!pedido) {
        resultadoPedido.innerHTML = '<div class="alert alert-danger">No encontramos un pedido con ese numero.</div>';
        return;
    }

    resultadoPedido.innerHTML = plantillaDetallePedido(pedido);
}

function configurarSeguimiento() {
    const inputPedido = document.getElementById('numeroPedido');
    if (!inputPedido) return;

    inputPedido.addEventListener('keydown', (evento) => {
        if (evento.key === 'Enter') void buscarPedidoPorNumero();
    });

    const pedidoUrl = new URLSearchParams(window.location.search).get('pedido');
    if (pedidoUrl) {
        inputPedido.value = pedidoUrl;
        void buscarPedidoPorNumero();
    }
}

function adminAutenticado() {
    return Boolean(localStorage.getItem(CLAVES.token));
}

function cambiarVistaAdmin() {
    const login = document.getElementById('admin-login');
    const panel = document.getElementById('admin-panel');
    const botonSalir = document.getElementById('btnAdminLogout');
    if (!login || !panel) return;

    const activo = adminAutenticado();
    login.classList.toggle('d-none', activo);
    panel.classList.toggle('d-none', !activo);
    if (botonSalir) botonSalir.classList.toggle('d-none', !activo);

    if (activo) {
        void renderizarPedidosAdmin();
        void renderizarProductosAdmin();
    }
}

function configurarLoginAdmin() {
    const formulario = document.getElementById('formAdminLogin');
    const error = document.getElementById('loginError');
    const botonSalir = document.getElementById('btnAdminLogout');

    if (formulario) {
        formulario.addEventListener('submit', async (evento) => {
            evento.preventDefault();
            const email = document.getElementById('adminEmail').value.trim().toLowerCase();
            const password = document.getElementById('adminPassword').value;

            try {
                const respuesta = await apiRequest('/login', {
                    method: 'POST',
                    body: { email, password },
                });

                localStorage.setItem(CLAVES.token, respuesta.token);
                formulario.reset();
                if (error) error.classList.add('d-none');
                cambiarVistaAdmin();
            } catch (apiError) {
                if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
                    localStorage.setItem(CLAVES.token, 'local-admin-token');
                    formulario.reset();
                    if (error) error.classList.add('d-none');
                    cambiarVistaAdmin();
                    return;
                }

                if (error) {
                    error.textContent = apiError.message || 'Correo o contrasena incorrectos.';
                    error.classList.remove('d-none');
                }
            }
        });
    }

    if (botonSalir) {
        botonSalir.addEventListener('click', () => {
            localStorage.removeItem(CLAVES.admin);
            localStorage.removeItem(CLAVES.token);
            cambiarVistaAdmin();
        });
    }
}

function mostrarSeccionPersonal(seccion) {
    const pedidos = document.getElementById('seccion-pedidos');
    const productos = document.getElementById('seccion-productos');
    if (!pedidos || !productos || !adminAutenticado()) return;

    document.querySelectorAll('[data-admin-tab]').forEach((tab) => {
        tab.classList.toggle('active', tab.dataset.adminTab === seccion);
    });

    pedidos.classList.toggle('d-none', seccion !== 'pedidos');
    productos.classList.toggle('d-none', seccion !== 'productos');

    if (seccion === 'pedidos') void renderizarPedidosAdmin();
    if (seccion === 'productos') void renderizarProductosAdmin();
}

function abrirNuevoProducto() {
    mostrarSeccionPersonal('productos');
    resetearFormularioProducto();

    const formulario = document.getElementById('formProducto');
    const nombre = document.getElementById('productoNombre');

    if (formulario) formulario.scrollIntoView({ behavior: 'smooth', block: 'start' });
    if (nombre) nombre.focus();
}

function configurarTabsAdmin() {
    document.querySelectorAll('[data-admin-tab]').forEach((tab) => {
        tab.addEventListener('click', () => mostrarSeccionPersonal(tab.dataset.adminTab));
    });
}

function actualizarConteosProductos(productos) {
    const conteos = { todos: productos.length, bebidas: 0, comidas: 0, postres: 0, snacks: 0 };

    productos.forEach((producto) => {
        conteos[producto.categoria] += 1;
    });

    document.querySelectorAll('[data-product-count]').forEach((span) => {
        span.textContent = conteos[span.dataset.productCount] ?? 0;
    });
}

function plantillaProductoAdmin(producto) {
    return `
        <article class="col-12 col-xl-6">
            <div class="card card-producto-personal h-100">
                <img src="${escaparHTML(producto.img)}" class="card-img-top" alt="${escaparHTML(producto.nombre)}">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start gap-3">
                        <div>
                            <h3 class="h5 fw-bold mb-1">${escaparHTML(producto.nombre)}</h3>
                            <p class="text-muted small mb-2">${CATEGORIAS[producto.categoria]}</p>
                        </div>
                        <div class="text-end">
                            <span class="texto-naranja fw-bold d-block">${formatoMoneda(producto.precio)}</span>
                            <span class="badge ${producto.activo ? 'bg-success' : 'bg-secondary'}">${producto.activo ? 'Activo' : 'Oculto'}</span>
                        </div>
                    </div>
                    <p class="text-secondary small">${escaparHTML(producto.descripcion || 'Sin descripcion')}</p>
                    <div class="d-flex flex-wrap gap-2">
                        <button class="btn btn-outline-primary btn-sm flex-fill" type="button" data-product-action="edit" data-id="${producto.id}">
                            <i class="bi bi-pencil me-1"></i>Editar
                        </button>
                        <button class="btn btn-outline-secondary btn-sm flex-fill" type="button" data-product-action="toggle" data-id="${producto.id}">
                            <i class="bi ${producto.activo ? 'bi-eye-slash' : 'bi-eye'} me-1"></i>${producto.activo ? 'Ocultar' : 'Activar'}
                        </button>
                        <button class="btn btn-outline-danger btn-sm" type="button" data-product-action="delete" data-id="${producto.id}" title="Eliminar">
                            <i class="bi bi-trash3"></i>
                        </button>
                    </div>
                </div>
            </div>
        </article>
    `;
}

async function renderizarProductosAdmin() {
    const contenedor = document.getElementById('listaProductosPersonal');
    if (!contenedor) return;

    const productos = await obtenerProductosRemotos();
    actualizarConteosProductos(productos);

    document.querySelectorAll('[data-product-filter]').forEach((boton) => {
        const activo = boton.dataset.productFilter === filtroProductosAdmin;
        boton.classList.toggle('btn-naranja', activo);
        boton.classList.toggle('btn-outline-secondary', !activo);
        boton.classList.toggle('bg-white', !activo);
    });

    const visibles = productos.filter((producto) => (
        filtroProductosAdmin === 'todos' || producto.categoria === filtroProductosAdmin
    ));

    if (visibles.length === 0) {
        contenedor.innerHTML = `
            <div class="col-12">
                <div class="empty-state bg-white border text-center">
                    <i class="bi bi-box-seam text-secondary"></i>
                    <p class="text-muted mb-0">No hay productos para mostrar.</p>
                </div>
            </div>
        `;
        return;
    }

    contenedor.innerHTML = visibles.map(plantillaProductoAdmin).join('');
}

function resetearFormularioProducto() {
    const formulario = document.getElementById('formProducto');
    const titulo = document.getElementById('tituloFormularioProducto');
    if (!formulario) return;

    formulario.reset();
    document.getElementById('productoId').value = '';
    document.getElementById('productoActivo').checked = true;
    if (titulo) titulo.textContent = 'Nuevo producto';
}

function cargarProductoEnFormulario(productoId) {
    const producto = obtenerProductos().find((item) => item.id === productoId);
    if (!producto) return;

    document.getElementById('productoId').value = producto.id;
    document.getElementById('productoNombre').value = producto.nombre;
    document.getElementById('productoCategoria').value = producto.categoria;
    document.getElementById('productoPrecio').value = producto.precio;
    document.getElementById('productoImagen').value = producto.img;
    document.getElementById('productoDescripcion').value = producto.descripcion;
    document.getElementById('productoActivo').checked = producto.activo;

    const titulo = document.getElementById('tituloFormularioProducto');
    if (titulo) titulo.textContent = 'Editar producto';

    document.getElementById('formProducto').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

async function guardarProductoDesdeFormulario(evento) {
    evento.preventDefault();

    const formulario = evento.currentTarget;
    if (!formulario.checkValidity()) {
        formulario.classList.add('was-validated');
        return;
    }

    const idActual = document.getElementById('productoId').value;
    const producto = {
        id: idActual || crearIdProducto(document.getElementById('productoNombre').value),
        nombre: document.getElementById('productoNombre').value.trim(),
        categoria: document.getElementById('productoCategoria').value,
        precio: Number(document.getElementById('productoPrecio').value),
        img: document.getElementById('productoImagen').value.trim() || 'img/cafe.jpg',
        descripcion: document.getElementById('productoDescripcion').value.trim(),
        activo: document.getElementById('productoActivo').checked,
    };

    let productoGuardadoLocal = producto;
    let mensaje = idActual ? 'Producto actualizado.' : 'Producto creado.';

    try {
        const ruta = idActual ? `/productos/${encodeURIComponent(idActual)}` : '/productos';
        const metodo = idActual ? 'PUT' : 'POST';
        const productoGuardado = await apiRequest(ruta, {
            method: metodo,
            body: productoParaApi(producto),
        });

        if (productoGuardado) {
            productoGuardadoLocal = productoDesdeApi(productoGuardado);
        }
    } catch (error) {
        mensaje = 'Producto guardado localmente porque la API no respondio.';
    }

    const productos = obtenerProductos();
    const existente = productos.findIndex((item) => (
        item.id === idActual || item.id === productoGuardadoLocal.id
    ));

    if (existente >= 0) {
        productos[existente] = productoGuardadoLocal;
    } else {
        productos.unshift(productoGuardadoLocal);
    }

    guardarProductos(productos);
    resetearFormularioProducto();
    formulario.classList.remove('was-validated');
    await renderizarProductosAdmin();
    mostrarAviso(mensaje, mensaje.includes('localmente') ? 'warning' : 'success');
}

function configurarProductosAdmin() {
    const formulario = document.getElementById('formProducto');
    const lista = document.getElementById('listaProductosPersonal');
    const botonLimpiar = document.getElementById('btnLimpiarProducto');
    const botonNuevo = document.getElementById('btnNuevoProducto');

    if (formulario) formulario.addEventListener('submit', guardarProductoDesdeFormulario);
    if (botonLimpiar) botonLimpiar.addEventListener('click', resetearFormularioProducto);
    if (botonNuevo) botonNuevo.addEventListener('click', abrirNuevoProducto);

    document.querySelectorAll('[data-product-filter]').forEach((boton) => {
        boton.addEventListener('click', () => {
            filtroProductosAdmin = boton.dataset.productFilter || 'todos';
            void renderizarProductosAdmin();
        });
    });

    if (lista) {
        lista.addEventListener('click', async (evento) => {
            const boton = evento.target.closest('[data-product-action]');
            if (!boton) return;

            const id = boton.dataset.id;
            const accion = boton.dataset.productAction;
            const productos = obtenerProductos();
            const producto = productos.find((item) => item.id === id);

            if (!producto) return;

            if (accion === 'edit') {
                cargarProductoEnFormulario(id);
            }

            if (accion === 'toggle') {
                producto.activo = !producto.activo;

                try {
                    await apiRequest(`/productos/${encodeURIComponent(id)}`, {
                        method: 'PUT',
                        body: productoParaApi(producto),
                    });
                } catch (error) {
                    guardarProductos(productos);
                    mostrarAviso('Producto actualizado localmente porque la API no respondio.', 'warning');
                }

                await renderizarProductosAdmin();
            }

            if (accion === 'delete') {
                try {
                    await apiRequest(`/productos/${encodeURIComponent(id)}`, {
                        method: 'DELETE',
                    });
                } catch (error) {
                    guardarProductos(productos.filter((item) => item.id !== id));
                    mostrarAviso('Producto eliminado localmente porque la API no respondio.', 'warning');
                }

                guardarCarrito(obtenerCarrito().filter((item) => item.id !== id));
                resetearFormularioProducto();
                await renderizarProductosAdmin();
                actualizarContadores();
                mostrarAviso(`Producto ${producto.nombre} eliminado.`, 'warning');
            }
        });
    }
}

function actualizarConteosPedidos(pedidos) {
    const conteos = { todos: pedidos.length, pendiente: 0, preparando: 0, listo: 0, entregado: 0 };

    pedidos.forEach((pedido) => {
        if (conteos[pedido.estado] !== undefined) conteos[pedido.estado] += 1;
    });

    document.querySelectorAll('[data-order-count]').forEach((span) => {
        span.textContent = conteos[span.dataset.orderCount] ?? 0;
    });
}

function plantillaPedidoAdmin(pedido) {
    const opciones = Object.entries(ESTADOS_PEDIDO).map(([valor, estado]) => `
        <option value="${valor}" ${pedido.estado === valor ? 'selected' : ''}>${estado.texto}</option>
    `).join('');

    const items = pedido.items.map((item) => `
        <span class="badge bg-light text-dark border">${item.cantidad}x ${escaparHTML(item.nombre)}</span>
    `).join('');

    return `
        <article class="card admin-card border-0 shadow-sm mb-3">
            <div class="card-body">
                <div class="d-flex flex-wrap justify-content-between gap-3 mb-3">
                    <div>
                        <h3 class="h5 fw-bold mb-1">${escaparHTML(pedido.id)}</h3>
                        <p class="text-muted small mb-0">${new Date(pedido.fecha).toLocaleString()}</p>
                    </div>
                    <span class="badge ${obtenerClaseEstado(pedido.estado)} align-self-start">${obtenerTextoEstado(pedido.estado)}</span>
                </div>
                <div class="row g-3">
                    <div class="col-md-4">
                        <p class="small text-muted mb-1">Cliente</p>
                        <p class="fw-semibold mb-0">${escaparHTML(pedido.cliente.nombre || 'Sin nombre')}</p>
                        <p class="small text-muted mb-0">${escaparHTML(pedido.cliente.telefono || '')}</p>
                    </div>
                    <div class="col-md-4">
                        <p class="small text-muted mb-1">Recoleccion</p>
                        <p class="fw-semibold mb-0">${escaparHTML(pedido.hora || 'Sin hora')}</p>
                        <p class="small text-muted mb-0">${escaparHTML(pedido.cliente.correo || '')}</p>
                    </div>
                    <div class="col-md-4">
                        <p class="small text-muted mb-1">Total</p>
                        <p class="h5 texto-naranja mb-0">${formatoMoneda(pedido.total)}</p>
                    </div>
                </div>
                <div class="d-flex flex-wrap gap-2 my-3">${items}</div>
                <div class="d-flex flex-wrap gap-2 align-items-center">
                    <select class="form-select admin-status-select" data-order-action="status" data-id="${pedido.id}" aria-label="Estado del pedido">
                        ${opciones}
                    </select>
                    <button class="btn btn-outline-danger btn-sm" type="button" data-order-action="delete" data-id="${pedido.id}">
                        <i class="bi bi-trash3 me-1"></i>Eliminar
                    </button>
                </div>
            </div>
        </article>
    `;
}

async function renderizarPedidosAdmin() {
    const contenedor = document.getElementById('listaPedidosAdmin');
    if (!contenedor) return;

    const pedidos = await obtenerPedidosRemotos();
    actualizarConteosPedidos(pedidos);

    document.querySelectorAll('[data-order-filter]').forEach((boton) => {
        const activo = boton.dataset.orderFilter === filtroPedidosAdmin;
        boton.classList.toggle('btn-naranja', activo);
        boton.classList.toggle('btn-outline-secondary', !activo);
        boton.classList.toggle('bg-white', !activo);
    });

    const visibles = pedidos.filter((pedido) => (
        filtroPedidosAdmin === 'todos' || pedido.estado === filtroPedidosAdmin
    ));

    if (visibles.length === 0) {
        contenedor.innerHTML = `
            <div class="empty-state bg-white border text-center">
                <i class="bi bi-bag text-secondary"></i>
                <p class="text-muted mb-0">No hay pedidos en esta vista.</p>
            </div>
        `;
        return;
    }

    contenedor.innerHTML = visibles.map(plantillaPedidoAdmin).join('');
}

function configurarPedidosAdmin() {
    const contenedor = document.getElementById('listaPedidosAdmin');

    document.querySelectorAll('[data-order-filter]').forEach((boton) => {
        boton.addEventListener('click', () => {
            filtroPedidosAdmin = boton.dataset.orderFilter || 'todos';
            void renderizarPedidosAdmin();
        });
    });

    if (!contenedor) return;

    contenedor.addEventListener('change', async (evento) => {
        const control = evento.target.closest('[data-order-action="status"]');
        if (!control) return;

        const pedidos = obtenerPedidos();
        const pedido = pedidos.find((item) => item.id === control.dataset.id);
        if (!pedido) return;

        pedido.estado = control.value;

        try {
            await apiRequest(`/pedidos/${encodeURIComponent(pedido.id)}`, {
                method: 'PUT',
                body: pedidoParaApi(pedido),
            });
        } catch (error) {
            guardarPedidos(pedidos);
            mostrarAviso('Pedido actualizado localmente porque la API no respondio.', 'warning');
        }

        await renderizarPedidosAdmin();
    });

    contenedor.addEventListener('click', async (evento) => {
        const boton = evento.target.closest('[data-order-action="delete"]');
        if (!boton) return;

        const pedidos = obtenerPedidos();
        const pedido = pedidos.find((item) => item.id === boton.dataset.id);

        if (pedido) {
            try {
                await apiRequest(`/pedidos/${encodeURIComponent(pedido.id)}`, {
                    method: 'DELETE',
                });
            } catch (error) {
                guardarPedidos(pedidos.filter((item) => item.id !== pedido.id));
                mostrarAviso('Pedido eliminado localmente porque la API no respondio.', 'warning');
            }

            await renderizarPedidosAdmin();
            mostrarAviso(`Pedido ${pedido.id} eliminado.`, 'warning');
        }
    });
}

function configurarAdmin() {
    if (!document.getElementById('admin-login')) return;

    configurarLoginAdmin();
    configurarTabsAdmin();
    configurarProductosAdmin();
    configurarPedidosAdmin();
    resetearFormularioProducto();
    cambiarVistaAdmin();
}

document.addEventListener('DOMContentLoaded', () => {
    obtenerProductos();
    configurarMenu();
    configurarCarrito();
    configurarCheckout();
    configurarSeguimiento();
    configurarAdmin();
    actualizarContadores();
});

window.buscarPedido = () => {
    void buscarPedidoPorNumero();
};
window.mostrarSeccionPersonal = mostrarSeccionPersonal;
window.abrirNuevoProducto = abrirNuevoProducto;
