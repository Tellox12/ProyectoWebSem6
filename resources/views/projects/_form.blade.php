@csrf

<div class="row g-3">
    <div class="col-12 col-lg-8">
        <label for="name" class="form-label fw-semibold">Nombre del proyecto</label>
        <input type="text" name="name" id="name" value="{{ old('name', $project->name ?? '') }}" class="form-control @error('name') is-invalid @enderror" required>
        @error('name')
            <div class="invalid-feedback">{{ $message }}</div>
        @enderror
    </div>

    <div class="col-12 col-lg-4">
        <label for="status" class="form-label fw-semibold">Estado</label>
        <select name="status" id="status" class="form-select @error('status') is-invalid @enderror" required>
            @foreach (['pendiente' => 'Pendiente', 'en_progreso' => 'En progreso', 'terminado' => 'Terminado', 'pausado' => 'Pausado'] as $value => $label)
                <option value="{{ $value }}" @selected(old('status', $project->status ?? 'pendiente') === $value)>{{ $label }}</option>
            @endforeach
        </select>
        @error('status')
            <div class="invalid-feedback">{{ $message }}</div>
        @enderror
    </div>

    <div class="col-12">
        <label for="description" class="form-label fw-semibold">Descripcion</label>
        <textarea name="description" id="description" rows="4" class="form-control @error('description') is-invalid @enderror">{{ old('description', $project->description ?? '') }}</textarea>
        @error('description')
            <div class="invalid-feedback">{{ $message }}</div>
        @enderror
    </div>

    <div class="col-12 col-md-4">
        <label for="start_date" class="form-label fw-semibold">Fecha de inicio</label>
        <input type="date" name="start_date" id="start_date" value="{{ old('start_date', isset($project) && $project->start_date ? $project->start_date->format('Y-m-d') : '') }}" class="form-control @error('start_date') is-invalid @enderror">
        @error('start_date')
            <div class="invalid-feedback">{{ $message }}</div>
        @enderror
    </div>

    <div class="col-12 col-md-4">
        <label for="end_date" class="form-label fw-semibold">Fecha final</label>
        <input type="date" name="end_date" id="end_date" value="{{ old('end_date', isset($project) && $project->end_date ? $project->end_date->format('Y-m-d') : '') }}" class="form-control @error('end_date') is-invalid @enderror">
        @error('end_date')
            <div class="invalid-feedback">{{ $message }}</div>
        @enderror
    </div>

    <div class="col-12 col-md-4">
        <label for="budget" class="form-label fw-semibold">Presupuesto</label>
        <input type="number" step="0.01" min="0" name="budget" id="budget" value="{{ old('budget', $project->budget ?? 0) }}" class="form-control @error('budget') is-invalid @enderror" required>
        @error('budget')
            <div class="invalid-feedback">{{ $message }}</div>
        @enderror
    </div>
</div>

<div class="d-flex gap-2 justify-content-end mt-4">
    <a href="{{ route('projects.index') }}" class="btn btn-outline-secondary">Cancelar</a>
    <button type="submit" class="btn btn-naranja">
        <i class="bi bi-save me-1"></i>
        Guardar
    </button>
</div>
