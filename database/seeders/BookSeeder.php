<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class BookSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('books')->insert([
            [
                'title' => 'Laskar Pelangi',
                'author_id' => 1,
                'description' => 'Kisah perjuangan anak-anak Belitung.',
                'published_year' => 2005,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => "Harry Potter and the Philosopher's Stone",
                'author_id' => 2,
                'description' => 'Petualangan Harry Potter di dunia sihir.',
                'published_year' => 1997,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'Bumi',
                'author_id' => 3,
                'description' => 'Petualangan di dunia paralel.',
                'published_year' => 2014,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => '1984',
                'author_id' => 4,
                'description' => 'Novel tentang masyarakat totaliter.',
                'published_year' => 1949,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'Murder on the Orient Express',
                'author_id' => 5,
                'description' => 'Kasus misteri yang diselidiki Hercule Poirot.',
                'published_year' => 1934,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}