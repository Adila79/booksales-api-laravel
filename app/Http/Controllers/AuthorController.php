<?php

namespace App\Http\Controllers;

use App\Models\Author;
use Illuminate\Http\JsonResponse;

class AuthorController extends Controller
{
    public function index(): JsonResponse
    {
        $authors = Author::with('books')->get();

        return response()->json([
            'success' => true,
            'message' => 'Data author berhasil ditampilkan',
            'data' => $authors
        ]);
    }
}