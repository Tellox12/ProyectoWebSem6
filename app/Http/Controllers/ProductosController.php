<?php

namespace App\Http\Controllers;

use App\Models\Producto;
use Illuminate\Http\Request;

class ProductosController extends Controller
{
    /**
     * Display a listing of the productos.
     */
    public function index()
    {
        $productos = Producto::all();

        return response()->json($productos);
    }

    /**
     * Show the form for creating a new producto.
     */
    public function create()
    {
        return 'Formulario para crear el producto desde el controlador';
    }

    /**
     * Store a newly created producto in storage.
     */
    public function store(Request $request)
    {
        $this->validarProducto($request);

        $producto = Producto::create($request->all());

        return response()->json($producto);
    }

    /**
     * Display the specified producto.
     */
    public function show(string $id)
    {
        $producto = Producto::find($id);

        return response()->json($producto);
    }

    /**
     * Show the form for editing the specified producto.
     */
    public function edit(string $id)
    {
        return 'Mostrar el formulario para editar el producto '.$id.' desde el controlador';
    }

    /**
     * Update the specified producto in storage.
     */
    public function update(Request $request, string $id)
    {
        $this->validarProducto($request);

        $producto = Producto::find($id);

        if (! $producto) {
            return response()->json([
                'message' => 'Producto no encontrado',
            ], 404);
        }

        $producto->update($request->all());

        return response()->json($producto);
    }

    /**
     * Remove the specified producto from storage.
     */
    public function destroy(string $id)
    {
        $producto = Producto::find($id);

        if (! $producto) {
            return response()->json([
                'message' => 'Producto no encontrado',
            ], 404);
        }

        $producto->delete();

        return response()->json([
            'message' => 'Producto eliminado correctamente',
        ]);
    }

    private function validarProducto(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string|max:80',
            'categoria' => 'required|string|in:bebidas,comidas,postres,snacks',
            'descripcion' => 'required|string|max:255',
            'precio' => 'required|numeric|min:0|max:999999.99',
            'img' => 'nullable|string|max:255',
            'activo' => 'required|boolean',
        ], [
            'categoria.in' => 'La categoria debe ser bebidas, comidas, postres o snacks',
            'precio.min' => 'El precio no puede ser negativo',
        ]);
    }
}
