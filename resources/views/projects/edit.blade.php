@extends('layouts.app')

@section('title', 'Editar proyecto - Pickup Express')

@section('content')
    <main class="container py-4">
        <div class="mb-4">
            <h2 class="h3 fw-bold mb-1">Editar proyecto</h2>
            <p class="text-muted mb-0">{{ $project->name }}</p>
        </div>

        <form action="{{ route('projects.update', $project) }}" method="POST" class="card border-0 shadow-sm p-4">
            @method('PUT')
            @include('projects._form')
        </form>
    </main>
@endsection
