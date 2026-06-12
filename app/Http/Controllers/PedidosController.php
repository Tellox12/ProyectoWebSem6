<?php

namespace App\Http\Controllers;

use App\Models\Pedido;
use Illuminate\Http\Request;

class PedidosController extends Controller
{
    /**
     * Display a listing of the pedidos.
     */
    public function index()
    {
        $pedidos = Pedido::all();

        return response()->json($pedidos);
    }

    /**
     * Show the form for creating a new pedido.
     */
    public function create()
    {
        return 'Formulario para crear el pedido desde el controlador';
    }

    /**
     * Store a newly created pedido in storage.
     */
    public function store(Request $request)
    {
        $this->validarPedido($request);

        $datos = $request->all();
        $datos['numero'] = $request->numero ?: $this->crearNumeroPedido();
        $datos['correo'] = $request->correo ?: '';
        $datos['estado'] = $request->estado ?: 'pendiente';

        $pedido = Pedido::create($datos);

        return response()->json($pedido);
    }

    /**
     * Display the specified pedido.
     */
    public function show(string $id)
    {
        $pedido = $this->buscarPedido($id);

        return response()->json($pedido);
    }

    /**
     * Show the form for editing the specified pedido.
     */
    public function edit(string $id)
    {
        return 'Mostrar el formulario para editar el pedido '.$id.' desde el controlador';
    }

    /**
     * Update the specified pedido in storage.
     */
    public function update(Request $request, string $id)
    {
        $this->validarPedido($request, true);

        $pedido = $this->buscarPedido($id);

        if (! $pedido) {
            return response()->json([
                'message' => 'Pedido no encontrado',
            ], 404);
        }

        $pedido->update($request->all());

        return response()->json($pedido);
    }

    /**
     * Remove the specified pedido from storage.
     */
    public function destroy(string $id)
    {
        $pedido = $this->buscarPedido($id);

        if (! $pedido) {
            return response()->json([
                'message' => 'Pedido no encontrado',
            ], 404);
        }

        $pedido->delete();

        return response()->json([
            'message' => 'Pedido eliminado correctamente',
        ]);
    }

    private function validarPedido(Request $request, bool $actualizando = false)
    {
        $request->validate([
            'numero' => $actualizando ? 'nullable|string|max:30' : 'nullable|string|max:30|unique:pedidos,numero',
            'nombre' => 'required|string|max:80',
            'telefono' => 'required|string|max:20',
            'correo' => 'nullable|email|max:120',
            'hora' => 'required|string|max:20',
            'notas' => 'nullable|string|max:255',
            'items' => 'required|array|min:1',
            'total' => 'required|numeric|min:0',
            'estado' => 'nullable|string|in:pendiente,preparando,listo,entregado,cancelado',
        ], [
            'items.min' => 'El pedido debe tener al menos un producto',
            'total.min' => 'El total no puede ser negativo',
            'estado.in' => 'El estado debe ser pendiente, preparando, listo, entregado o cancelado',
        ]);
    }

    private function buscarPedido(string $id)
    {
        return Pedido::where('numero', $id)->orWhere('id', $id)->first();
    }

    private function crearNumeroPedido(): string
    {
        return 'ORD-'.now()->format('Ymd').'-'.strtoupper(substr(str_shuffle('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 4));
    }
}
