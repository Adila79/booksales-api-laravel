<?php

namespace App\Http\Controllers;

use App\Models\Book;
use Illuminate\Http\JsonResponse;

class BookController extends Controller
{
    public function index(): JsonResponse
    {
        $books = Book::with('author')->get();

        return response()->json([
            'success' => true,
            'message' => 'Data buku berhasil ditampilkan',
            'data' => $books
        ]);
    }
}