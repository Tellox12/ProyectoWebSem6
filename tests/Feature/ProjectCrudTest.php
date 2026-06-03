<?php

namespace Tests\Feature;

use App\Models\Project;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProjectCrudTest extends TestCase
{
    use RefreshDatabase;

    public function test_project_can_be_created_updated_and_deleted(): void
    {
        $this->post(route('projects.store'), [
            'name' => 'Proyecto web',
            'description' => 'CRUD de proyectos en Laravel.',
            'status' => 'pendiente',
            'start_date' => '2026-05-29',
            'end_date' => '2026-06-10',
            'budget' => '900.00',
        ])->assertRedirect(route('projects.index'));

        $project = Project::firstOrFail();

        $this->put(route('projects.update', $project), [
            'name' => 'Proyecto web actualizado',
            'description' => 'CRUD completo con vistas Blade.',
            'status' => 'en_progreso',
            'start_date' => '2026-05-29',
            'end_date' => '2026-06-20',
            'budget' => '1200.00',
        ])->assertRedirect(route('projects.index'));

        $this->assertDatabaseHas('projects', [
            'id' => $project->id,
            'name' => 'Proyecto web actualizado',
            'status' => 'en_progreso',
        ]);

        $this->delete(route('projects.destroy', $project))
            ->assertRedirect(route('projects.index'));

        $this->assertDatabaseMissing('projects', [
            'id' => $project->id,
        ]);
    }
}
