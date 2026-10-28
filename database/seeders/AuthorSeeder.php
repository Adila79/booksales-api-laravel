
<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AuthorSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('authors')->insert([
            [
                'name' => 'Andrea Hirata',
                'country' => 'Indonesia',
                'bio' => 'Penulis novel Laskar Pelangi',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'J.K. Rowling',
                'country' => 'United Kingdom',
                'bio' => 'Penulis seri Harry Potter',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Tere Liye',
                'country' => 'Indonesia',
                'bio' => 'Penulis novel Indonesia',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'George Orwell',
                'country' => 'United Kingdom',
                'bio' => 'Penulis Animal Farm dan 1984',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Agatha Christie',
                'country' => 'United Kingdom',
                'bio' => 'Penulis novel misteri',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
