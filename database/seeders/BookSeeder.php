<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class BookSeeder extends Seeder
{
    public function run(): void
    {
        $books = [
            [
                'title' => 'Laskar Pelangi',
                'author' => 'Andrea Hirata',
                'country' => 'Indonesia',
                'description' => 'Kisah perjuangan anak-anak Belitung.',
                'year' => 2005,
                'price' => 85000,
            ],
            [
                'title' => 'Bumi',
                'author' => 'Tere Liye',
                'country' => 'Indonesia',
                'description' => 'Petualangan di dunia paralel.',
                'year' => 2014,
                'price' => 95000,
            ],
            [
                'title' => 'Atomic Habits',
                'author' => 'James Clear',
                'country' => 'United States',
                'description' => 'Panduan membangun kebiasaan baik.',
                'year' => 2018,
                'price' => 120000,
            ],
            [
                'title' => 'Filosofi Teras',
                'author' => 'Henry Manampiring',
                'country' => 'Indonesia',
                'description' => 'Pengantar filsafat Stoisisme.',
                'year' => 2018,
                'price' => 98000,
            ],
            [
                'title' => 'Negeri 5 Menara',
                'author' => 'Ahmad Fuadi',
                'country' => 'Indonesia',
                'description' => 'Kisah perjuangan dan persahabatan di pesantren.',
                'year' => 2009,
                'price' => 90000,
            ],
            [
                'title' => 'Rich Dad Poor Dad',
                'author' => 'Robert T. Kiyosaki',
                'country' => 'United States',
                'description' => 'Buku tentang pendidikan dan pola pikir keuangan.',
                'year' => 1997,
                'price' => 110000,
            ],
            [
                'title' => 'The Psychology of Money',
                'author' => 'Morgan Housel',
                'country' => 'United States',
                'description' => 'Pelajaran tentang perilaku dan keputusan keuangan.',
                'year' => 2020,
                'price' => 115000,
            ],
            [
                'title' => 'Dilan 1990',
                'author' => 'Pidi Baiq',
                'country' => 'Indonesia',
                'description' => 'Kisah cinta remaja di Bandung.',
                'year' => 2014,
                'price' => 75000,
            ],
            [
                'title' => 'Bicara Itu Ada Seninya',
                'author' => 'Oh Su Hyang',
                'country' => 'South Korea',
                'description' => 'Panduan meningkatkan kemampuan komunikasi.',
                'year' => 2018,
                'price' => 88000,
            ],
        ];

        foreach ($books as $book) {
            DB::table('authors')->updateOrInsert(
                ['name' => $book['author']],
                [
                    'country' => $book['country'],
                    'updated_at' => now(),
                ]
            );

            $author = DB::table('authors')
                ->where('name', $book['author'])
                ->first();

            DB::table('books')->updateOrInsert(
                ['title' => $book['title']],
                [
                    'author_id' => $author->id,
                    'description' => $book['description'],
                    'published_year' => $book['year'],
                    'price' => $book['price'],
                    'updated_at' => now(),
                    'created_at' => now(),
                ]
            );
        }
    }
}
