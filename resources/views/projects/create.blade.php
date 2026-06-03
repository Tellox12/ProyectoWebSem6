@extends('layouts.app')

@section('title', 'Nuevo proyecto - Pickup Express')

@section('content')
    <main class="container py-4">
        <div class="mb-4">
            <h2 class="h3 fw-bold mb-1">Nuevo proyecto</h2>
            <p class="text-muted mb-0">Registra los datos principales del proyecto.</p>
        </div>

        <form action="{{ route('projects.store') }}" method="POST" class="card border-0 shadow-sm p-4">
            @include('projects._form')
        </form>
    </main>
@endsection
