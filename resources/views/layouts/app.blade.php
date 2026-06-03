<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@yield('title', 'Pickup Express')</title>

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css">
    <link rel="stylesheet" href="{{ asset('estilos.css') }}">
</head>
<body class="bg-light">
    <header class="bg-white shadow-sm py-3">
        <div class="container d-flex flex-wrap gap-3 justify-content-between align-items-center">
            <a href="{{ route('home') }}" class="d-flex align-items-center gap-2 text-decoration-none text-dark">
                <div class="logo-p">P</div>
                <h1 class="h4 mb-0 fw-bold">Pickup Express</h1>
            </a>

            <nav class="d-flex flex-wrap gap-3 align-items-center">
                <a href="{{ route('home') }}#menu" class="text-decoration-none text-dark">Menu</a>
                <a href="{{ route('projects.index') }}" class="text-decoration-none text-secondary">Proyectos</a>
                <a href="{{ route('projects.create') }}" class="btn btn-naranja btn-sm">
                    <i class="bi bi-plus-lg me-1"></i>
                    Nuevo proyecto
                </a>
            </nav>
        </div>
    </header>

    @if (session('success'))
        <div class="container mt-4">
            <div class="alert alert-success mb-0">{{ session('success') }}</div>
        </div>
    @endif

    @yield('content')

    <script src="{{ asset('logica.js') }}"></script>
</body>
</html>
