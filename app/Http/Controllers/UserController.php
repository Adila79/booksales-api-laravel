<?php

namespace App\Http\Controllers;

use App\Models\User;

class UserController extends Controller
{
    public function index()
    {
        $users = User::select('id', 'name', 'email', 'role')
            ->latest()
            ->get();

        return response()->json([
            'success' => true,
            'message' => 'Daftar User berhasil diambil',
            'data' => $users,
        ]);
    }
}
