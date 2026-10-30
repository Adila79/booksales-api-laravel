<?php

namespace App\Http\Controllers;

use App\Models\Author;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class AuthorController extends Controller
{
    // Read All Author
    public function index(): JsonResponse
    {
        $authors = Author::with('books')->get();

        return response()->json([
            'success' => true,
            'message' => 'Data author berhasil ditampilkan',
            'data' => $authors
        ]);
    }

    // Create Author
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'country' => 'required|string|max:255',
            'bio' => 'nullable|string',
        ]);

        $author = Author::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Author berhasil ditambahkan',
            'data' => $author
        ], 201);
    }
}