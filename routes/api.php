<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\BookController;
use App\Http\Controllers\AuthorController;
use App\Http\Controllers\GenreController;
use App\Http\Controllers\AuthController;

// Books: Read publik
Route::get('/books', [BookController::class, 'index']);

// Register dan Login
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Logout: harus login
Route::post('/logout', [AuthController::class, 'logout'])
    ->middleware('auth:sanctum');

// Authors: Read publik
Route::apiResource('authors', AuthorController::class)
    ->only(['index', 'show']);

// Genres: Read publik
Route::apiResource('genres', GenreController::class)
    ->only(['index', 'show']);

// Authors dan Genres: hanya admin yang sudah login
Route::middleware(['auth:sanctum', 'admin'])->group(function () {

    Route::apiResource('authors', AuthorController::class)
        ->except(['index', 'show']);

    Route::apiResource('genres', GenreController::class)
        ->except(['index', 'show']);

});
