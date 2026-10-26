<?php
namespace App\Models;

class Author
{
    public static function getAll()
    {
        return [
            ['id' => 1, 'name' => 'Andrea Hirata', 'country' => 'Indonesia'],
            ['id' => 2, 'name' => 'J.K. Rowling', 'country' => 'United Kingdom'],
            ['id' => 3, 'name' => 'Tere Liye', 'country' => 'Indonesia'],
            ['id' => 4, 'name' => 'George Orwell', 'country' => 'United Kingdom'],
            ['id' => 5, 'name' => 'Agatha Christie', 'country' => 'United Kingdom'],
        ];
    }
}