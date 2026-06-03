<?php

use App\Http\Controllers\ProjectController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->file(base_path('index.html'));
})->name('home');

Route::get('/index.html', fn () => response()->file(base_path('index.html')));
Route::get('/carrito.html', fn () => response()->file(base_path('carrito.html')));
Route::get('/checkout.html', fn () => response()->file(base_path('checkout.html')));
Route::get('/seguimiento.html', fn () => response()->file(base_path('seguimiento.html')));
Route::get('/personal.html', fn () => response()->file(base_path('personal.html')));

Route::resource('proyectos', ProjectController::class)
    ->parameters(['proyectos' => 'project'])
    ->names('projects');

Route::redirect('/projects', '/proyectos');
