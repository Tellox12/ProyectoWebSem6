const botonesAgregar = document.querySelectorAll('.btn-agregar');
const globoCarrito = document.getElementById('contador-carrito');

// 1. Función para actualizar el número en el globo rojo
function actualizarContador() {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    let totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
    
    if (totalItems > 0) {
        globoCarrito.innerText = totalItems;
        globoCarrito.classList.remove('d-none');
    } else {
        globoCarrito.classList.add('d-none');
    }
}

// 2. Lógica para capturar el clic en el botón "+"
botonesAgregar.forEach(boton => {
    boton.addEventListener('click', (e) => {
        // Buscamos la tarjeta (article) más cercana al botón pulsado
        const tarjeta = e.target.closest('article');
        
        const producto = {
            id: tarjeta.querySelector('.card-title').innerText, // Usamos el nombre como ID único
            nombre: tarjeta.querySelector('.card-title').innerText,
            precio: parseFloat(tarjeta.querySelector('.texto-naranja').innerText.replace('$', '')),
            img: tarjeta.querySelector('img').getAttribute('src'), // Captura la ruta de la imagen
            cantidad: 1
        };

        let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

        // Si ya existe, aumentamos cantidad. Si no, lo agregamos.
        const existe = carrito.find(item => item.id === producto.id);
        if (existe) {
            existe.cantidad += 1;
        } else {
            carrito.push(producto);
        }

        // Guardamos en la memoria del navegador
        localStorage.setItem('carrito', JSON.stringify(carrito));

        // Actualizamos el número rojo arriba
        actualizarContador();
    });
});

// Al cargar la página, checar si ya había algo guardado
document.addEventListener('DOMContentLoaded', actualizarContador);

const botonesFiltro = document.querySelectorAll('.btn-filtro');
const productos = document.querySelectorAll('.producto');

botonesFiltro.forEach(boton => {
    boton.addEventListener('click', () => {
        const categoriaSeleccionada = boton.dataset.categoria;

        botonesFiltro.forEach(btn => {
            btn.classList.remove('btn-naranja');
            btn.classList.add('btn-outline-secondary', 'bg-white');
        });

        boton.classList.remove('btn-outline-secondary', 'bg-white');
        boton.classList.add('btn-naranja');

        productos.forEach(producto => {
            const categoriaProducto = producto.dataset.categoria;

            if (categoriaSeleccionada === 'todos' || categoriaProducto === categoriaSeleccionada) {
                producto.classList.remove('d-none');
            } else {
                producto.classList.add('d-none');
            }
        });
    });
});

function buscarPedido() {
    const inputPedido = document.getElementById('numeroPedido');
    const resultadoPedido = document.getElementById('resultadoPedido');

    if (!inputPedido || !resultadoPedido) return;

    const numeroPedido = inputPedido.value.trim();

    if (!numeroPedido) {
        resultadoPedido.innerHTML = `
            <div class="alert alert-warning">
                Ingresa un número de pedido.
            </div>
        `;
        return;
    }

    resultadoPedido.innerHTML = `
        <div class="card border-0 shadow-sm rounded-3 p-4">
            <h5 class="fw-bold mb-3">Pedido encontrado</h5>

            <p class="mb-2">
                <strong>Número:</strong> ${numeroPedido}
            </p>

            <p class="mb-2">
                <strong>Estado:</strong>
                <span class="badge bg-warning text-dark">En preparación</span>
            </p>
        </div>
    `;
}

function mostrarSeccionPersonal(seccion) {
    const pedidos = document.getElementById('seccion-pedidos');
    const productos = document.getElementById('seccion-productos');
    const tabs = document.querySelectorAll('.btn-tab-personal');

    if (!pedidos || !productos) return;

    tabs.forEach(tab => tab.classList.remove('active'));

    if (seccion === 'pedidos') {
        pedidos.classList.remove('d-none');
        productos.classList.add('d-none');
        tabs[0].classList.add('active');
    } else {
        pedidos.classList.add('d-none');
        productos.classList.remove('d-none');
        tabs[1].classList.add('active');
        cargarProductosPersonal();
    }
}

function cargarProductosPersonal() {
    const contenedor = document.getElementById('listaProductosPersonal');

    if (!contenedor) return;

    const productos = [
        {
            nombre: 'Café Americano',
            categoria: 'Bebidas',
            descripcion: 'Café expreso con agua caliente',
            precio: 3.50,
            img: 'img/cafe.jpg'
        },
        {
            nombre: 'Cappuccino',
            categoria: 'Bebidas',
            descripcion: 'Café expreso con espuma de leche',
            precio: 4.50,
            img: 'img/cappuccino.jpg'
        },
        {
            nombre: 'Té Verde',
            categoria: 'Bebidas',
            descripcion: 'Té verde natural',
            precio: 3.00,
            img: 'img/te.jpeg'
        },
        {
            nombre: 'Jugo de Naranja',
            categoria: 'Bebidas',
            descripcion: 'Jugo natural de naranja recién exprimido',
            precio: 4.00,
            img: 'img/jugo.jpg'
        }
    ];

    contenedor.innerHTML = '';

    productos.forEach(producto => {
        contenedor.innerHTML += `
            <article class="col-12 col-md-6 col-lg-4">
                <div class="card card-producto-personal h-100">

                    <img src="${producto.img}" class="card-img-top" alt="${producto.nombre}">

                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-start">
                            <div>
                                <h5 class="fw-bold mb-1">${producto.nombre}</h5>
                                <p class="text-muted small mb-2">${producto.categoria}</p>
                            </div>

                            <span class="texto-naranja fw-bold">
                                $${producto.precio.toFixed(2)}
                            </span>
                        </div>

                        <p class="text-secondary small">${producto.descripcion}</p>

                        <div class="d-flex gap-2">
                            <button class="btn btn-primary flex-fill">
                                <i class="bi bi-pencil me-1"></i>
                                Editar
                            </button>

                            <button class="btn btn-desactivar flex-fill">
                                <i class="bi bi-eye-slash me-1"></i>
                                Desactivar
                            </button>

                            <button class="btn btn-danger">
                                <i class="bi bi-trash3"></i>
                            </button>
                        </div>
                    </div>

                </div>
            </article>
        `;
    });
}

document.addEventListener('DOMContentLoaded', () => {
    cargarProductosPersonal();
});