<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\PedidosController;
use App\Http\Controllers\ProductosController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return 'Respuesta desde API';
});

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::resource('productos', ProductosController::class);
Route::resource('pedidos', PedidosController::class);

Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
