@extends('layouts.app')

@section('title', $project->name . ' - Pickup Express')

@section('content')
    <main class="container py-4">
        <div class="d-flex flex-wrap gap-2 justify-content-between align-items-start mb-4">
            <div>
                <h2 class="h3 fw-bold mb-1">{{ $project->name }}</h2>
                <span class="badge text-bg-secondary">{{ str_replace('_', ' ', ucfirst($project->status)) }}</span>
            </div>

            <div class="d-flex gap-2">
                <a href="{{ route('projects.index') }}" class="btn btn-outline-secondary">Volver</a>
                <a href="{{ route('projects.edit', $project) }}" class="btn btn-primary">
                    <i class="bi bi-pencil me-1"></i>
                    Editar
                </a>
            </div>
        </div>

        <section class="card border-0 shadow-sm p-4">
            <p class="text-muted">{{ $project->description ?: 'Este proyecto no tiene descripcion.' }}</p>

            <div class="row g-3 mt-2">
                <div class="col-12 col-md-4">
                    <div class="fw-semibold">Inicio</div>
                    <div class="text-muted">{{ $project->start_date?->format('d/m/Y') ?? 'No definido' }}</div>
                </div>
                <div class="col-12 col-md-4">
                    <div class="fw-semibold">Final</div>
                    <div class="text-muted">{{ $project->end_date?->format('d/m/Y') ?? 'No definido' }}</div>
                </div>
                <div class="col-12 col-md-4">
                    <div class="fw-semibold">Presupuesto</div>
                    <div class="texto-naranja fw-bold">${{ number_format((float) $project->budget, 2) }}</div>
                </div>
            </div>
        </section>
    </main>
@endsection
