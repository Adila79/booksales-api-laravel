<?php
namespace App\Models;

class Genre
{
    public static function getAll()
    {
        return [
            [
                'id' => 1,
                'name' => 'Fantasy',
                'description' => 'Cerita dengan unsur sihir dan dunia imajinasi'
            ],
            [
                'id' => 2,
                'name' => 'Romance',
                'description' => 'Cerita tentang cinta'
            ],
            [
                'id' => 3,
                'name' => 'Horror',
                'description' => 'Cerita yang menakutkan'
            ],
            [
                'id' => 4,
                'name' => 'Mystery',
                'description' => 'Cerita tentang misteri'
            ],
            [
                'id' => 5,
                'name' => 'Science Fiction',
                'description' => 'Cerita tentang sains dan teknologi'
            ],
        ];
    }
}