<?php

namespace App\Http\Controllers;

use App\Models\Genre;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class GenreController extends Controller
{
    // Read All Genre
    public function index(): JsonResponse
    {
        $genres = Genre::all();

        return response()->json([
            'success' => true,
            'message' => 'Data genre berhasil ditampilkan',
            'data' => $genres
        ]);
    }

    // Create Genre
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $genre = Genre::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Genre berhasil ditambahkan',
            'data' => $genre
        ], 201);
    }

    // Show Genre
    public function show(string $id): JsonResponse
    {
        $genre = Genre::find($id);

        if (!$genre) {
            return response()->json([
                'success' => false,
                'message' => 'Genre tidak ditemukan'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Detail genre berhasil ditampilkan',
            'data' => $genre
        ]);
    }

    // Update Genre
    public function update(Request $request, string $id): JsonResponse
    {
        $genre = Genre::find($id);

        if (!$genre) {
            return response()->json([
                'success' => false,
                'message' => 'Genre tidak ditemukan'
            ], 404);
        }

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $genre->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Genre berhasil diperbarui',
            'data' => $genre
        ]);
    }

    // Destroy Genre
    public function destroy(string $id): JsonResponse
    {
        $genre = Genre::find($id);

        if (!$genre) {
            return response()->json([
                'success' => false,
                'message' => 'Genre tidak ditemukan'
            ], 404);
        }

        $genre->delete();

        return response()->json([
            'success' => true,
            'message' => 'Genre berhasil dihapus'
        ]);
    }
}
