
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Daftar Buku</title>
</head>
<body>
    <h1>Daftar Buku</h1>

    <a href="/authors">Lihat Daftar Author</a>

    <table border="1" cellpadding="10">
        <thead>
            <tr>
                <th>No.</th>
                <th>Judul Buku</th>
                <th>Author</th>
                <th>Deskripsi</th>
                <th>Tahun Terbit</th>
            </tr>
        </thead>
        <tbody>
            @forelse ($books as $book)
                <tr>
                    <td>{{ $loop->iteration }}</td>
                    <td>{{ $book->title }}</td>
                    <td>{{ $book->author->name }}</td>
                    <td>{{ $book->description }}</td>
                    <td>{{ $book->published_year }}</td>
                </tr>
            @empty
                <tr>
                    <td colspan="5">Belum ada data buku.</td>
                </tr>
            @endforelse
        </tbody>
    </table>
</body>
</html>
