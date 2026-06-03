@extends('layouts.app')

@section('title', 'Proyectos - Pickup Express')

@section('content')
    <main class="container py-4">
        <div class="d-flex flex-wrap gap-3 justify-content-between align-items-center mb-4">
            <div>
                <h2 class="h3 fw-bold mb-1">Gestion de Proyectos</h2>
                <p class="text-muted mb-0">CRUD conectado con rutas, controlador, modelo y vistas Laravel.</p>
            </div>

            <a href="{{ route('projects.create') }}" class="btn btn-naranja fw-bold">
                <i class="bi bi-plus-lg me-1"></i>
                Nuevo proyecto
            </a>
        </div>

        <div class="card border-0 shadow-sm">
            <div class="table-responsive">
                <table class="table align-middle mb-0">
                    <thead class="table-light">
                        <tr>
                            <th>Proyecto</th>
                            <th>Estado</th>
                            <th>Fechas</th>
                            <th>Presupuesto</th>
                            <th class="text-end">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse ($projects as $project)
                            <tr>
                                <td>
                                    <div class="fw-bold">{{ $project->name }}</div>
                                    <div class="text-muted small">{{ $project->description ? str($project->description)->limit(70) : 'Sin descripcion' }}</div>
                                </td>
                                <td>
                                    <span class="badge text-bg-{{ $project->status === 'terminado' ? 'success' : ($project->status === 'pausado' ? 'secondary' : 'warning') }}">
                                        {{ str_replace('_', ' ', ucfirst($project->status)) }}
                                    </span>
                                </td>
                                <td class="text-muted small">
                                    {{ $project->start_date?->format('d/m/Y') ?? 'Sin inicio' }}
                                    -
                                    {{ $project->end_date?->format('d/m/Y') ?? 'Sin final' }}
                                </td>
                                <td class="fw-semibold">${{ number_format((float) $project->budget, 2) }}</td>
                                <td>
                                    <div class="d-flex gap-2 justify-content-end">
                                        <a href="{{ route('projects.show', $project) }}" class="btn btn-sm btn-outline-secondary" title="Ver">
                                            <i class="bi bi-eye"></i>
                                        </a>
                                        <a href="{{ route('projects.edit', $project) }}" class="btn btn-sm btn-primary" title="Editar">
                                            <i class="bi bi-pencil"></i>
                                        </a>
                                        <form action="{{ route('projects.destroy', $project) }}" method="POST" onsubmit="return confirm('¿Eliminar este proyecto?')">
                                            @csrf
                                            @method('DELETE')
                                            <button type="submit" class="btn btn-sm btn-danger" title="Eliminar">
                                                <i class="bi bi-trash3"></i>
                                            </button>
                                        </form>
                                    </div>
                                </td>
                            </tr>
                        @empty
                            <tr>
                                <td colspan="5" class="text-center py-5">
                                    <i class="bi bi-folder2-open text-secondary" style="font-size: 48px;"></i>
                                    <p class="text-muted mt-3 mb-3">Todavia no hay proyectos registrados.</p>
                                    <a href="{{ route('projects.create') }}" class="btn btn-naranja">Crear el primero</a>
                                </td>
                            </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>

            @if ($projects->hasPages())
                <div class="card-footer bg-white">
                    {{ $projects->links() }}
                </div>
            @endif
        </div>
    </main>
@endsection
