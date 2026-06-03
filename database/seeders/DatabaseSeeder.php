<?php

namespace Database\Seeders;

use App\Models\Producto;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@pickupexpress.com'],
            [
                'name' => 'Administrador',
                'password' => Hash::make('admin123'),
            ]
        );

        Producto::updateOrCreate(
            ['nombre' => 'Cafe Americano'],
            [
                'categoria' => 'bebidas',
                'descripcion' => 'Cafe expreso con agua caliente',
                'precio' => 3.50,
                'img' => 'img/cafe.jpg',
                'activo' => true,
            ]
        );

        Producto::updateOrCreate(
            ['nombre' => 'Cappuccino'],
            [
                'categoria' => 'bebidas',
                'descripcion' => 'Cafe expreso con espuma de leche',
                'precio' => 4.50,
                'img' => 'img/cappuccino.jpg',
                'activo' => true,
            ]
        );

        Producto::updateOrCreate(
            ['nombre' => 'Te Verde'],
            [
                'categoria' => 'bebidas',
                'descripcion' => 'Te verde natural',
                'precio' => 3.00,
                'img' => 'img/te.jpeg',
                'activo' => true,
            ]
        );

        Producto::updateOrCreate(
            ['nombre' => 'Jugo de Naranja'],
            [
                'categoria' => 'bebidas',
                'descripcion' => 'Jugo natural de naranja recien exprimido',
                'precio' => 4.00,
                'img' => 'img/jugo.jpg',
                'activo' => true,
            ]
        );
    }
}
