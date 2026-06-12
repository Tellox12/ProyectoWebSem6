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

        Producto::updateOrCreate(
            ['nombre' => 'Hamburguesa Artesanal'],
            [
                'categoria' => 'comidas',
                'descripcion' => 'Hamburguesa con carne, lechuga, tomate y pan rustico',
                'precio' => 8.50,
                'img' => 'img/hamburguesa.jpg',
                'activo' => true,
            ]
        );

        Producto::updateOrCreate(
            ['nombre' => 'Tacos Variados'],
            [
                'categoria' => 'comidas',
                'descripcion' => 'Orden de tacos con salsas frescas y limon',
                'precio' => 7.00,
                'img' => 'img/tacos.jpg',
                'activo' => true,
            ]
        );

        Producto::updateOrCreate(
            ['nombre' => 'Ensalada de Pollo'],
            [
                'categoria' => 'comidas',
                'descripcion' => 'Ensalada fresca con pollo, hojas verdes y granada',
                'precio' => 6.50,
                'img' => 'img/ensalada-pollo.jpg',
                'activo' => true,
            ]
        );

        Producto::updateOrCreate(
            ['nombre' => 'Wrap Vegetariano'],
            [
                'categoria' => 'comidas',
                'descripcion' => 'Wrap con vegetales frescos, lechuga y tomate',
                'precio' => 6.00,
                'img' => 'img/wrap-vegetariano.jpg',
                'activo' => true,
            ]
        );
    }
}
