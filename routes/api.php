<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\AuthorController;
use App\Http\Controllers\BookController;
use App\Http\Controllers\GenreController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

// Books: Read publik
Route::get('/books', [BookController::class, 'index']);

// Register dan Login
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Midtrans akan memanggil endpoint ini tanpa autentikasi
Route::post('/payments/midtrans/notification', [OrderController::class, 'midtransNotification']);

// Logout: harus login
Route::post('/logout', [AuthController::class, 'logout'])
    ->middleware('auth:sanctum');

// Authors: Read publik
Route::apiResource('authors', AuthorController::class)
    ->only(['index', 'show']);

// Genres: Read publik
Route::apiResource('genres', GenreController::class)
    ->only(['index', 'show']);

// User membuat pesanan
Route::post('/orders', [OrderController::class, 'store'])
    ->middleware('auth:sanctum');

// User melihat riwayat pesanannya sendiri
Route::get('/my-orders', [OrderController::class, 'myOrders'])
    ->middleware('auth:sanctum');

// Khusus Admin yang sudah login
Route::middleware(['auth:sanctum', 'admin'])->group(function () {

    // CRUD Author
    Route::apiResource('authors', AuthorController::class)
        ->except(['index', 'show']);

    // CRUD Genre
    Route::apiResource('genres', GenreController::class)
        ->except(['index', 'show']);

    // Daftar User
    Route::get('/users', [UserController::class, 'index']);

    // Semua pesanan untuk Admin
    Route::get('/orders', [OrderController::class, 'index']);

    // Konfirmasi pembayaran COD
    Route::patch('/orders/{order}/payment', [OrderController::class, 'confirmPayment']);

    // Admin mengubah status pesanan
    Route::patch('/orders/{order}/status', [OrderController::class, 'updateStatus']);
});
