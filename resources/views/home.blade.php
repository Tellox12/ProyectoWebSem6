@extends('layouts.app')

@section('title', 'Pickup Express')

@section('content')
    <section id="inicio" class="fondo-naranja text-white py-5 mb-4">
        <div class="container">
            <h2 class="display-5 fw-bold">Nuestro Menu</h2>
            <p class="lead mb-0">Selecciona tus productos favoritos y revisa tus proyectos desde el panel.</p>
        </div>
    </section>

    <section id="menu" class="container mb-5">
        <div class="d-flex flex-wrap gap-2 mb-4">
            <button class="btn btn-naranja rounded-pill px-4 btn-filtro" data-categoria="todos">Todos</button>
            <button class="btn btn-outline-secondary bg-white rounded-pill px-4 btn-filtro" data-categoria="bebidas">Bebidas</button>
            <button class="btn btn-outline-secondary bg-white rounded-pill px-4 btn-filtro" data-categoria="comidas">Comidas</button>
            <button class="btn btn-outline-secondary bg-white rounded-pill px-4 btn-filtro" data-categoria="postres">Postres</button>
            <button class="btn btn-outline-secondary bg-white rounded-pill px-4 btn-filtro" data-categoria="snacks">Snacks</button>
        </div>

        <div class="row g-4">
            @foreach ([
                ['Café Americano', 'Café expreso con agua caliente', '3.50', 'img/cafe.jpg'],
                ['Cappuccino', 'Café expreso con espuma de leche', '4.50', 'img/cappuccino.jpg'],
                ['Té Verde', 'Té verde natural', '3.00', 'img/te.jpeg'],
                ['Jugo de Naranja', 'Jugo natural de naranja recién exprimido', '4.00', 'img/jugo.jpg'],
            ] as [$name, $description, $price, $image])
                <article class="col-12 col-md-6 col-lg-3 producto" data-categoria="bebidas">
                    <div class="tarjeta card h-100 shadow-sm border-0">
                        <img src="{{ asset($image) }}" class="card-img-top img-producto" alt="{{ $name }}">
                        <div class="card-body d-flex flex-column">
                            <h3 class="card-title h6 fw-bold">{{ $name }}</h3>
                            <p class="card-text text-muted small mb-3">{{ $description }}</p>
                            <div class="mt-auto d-flex justify-content-between align-items-center">
                                <span class="texto-naranja fw-bold">${{ $price }}</span>
                                <button class="btn btn-naranja btn-sm btn-agregar">+</button>
                            </div>
                        </div>
                    </div>
                </article>
            @endforeach
        </div>
    </section>
@endsection
