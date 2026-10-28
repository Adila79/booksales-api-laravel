
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Daftar Author</title>
</head>
<body>
    <h1>Daftar Author Buku</h1>

    <table border="1" cellpadding="10">
        <tr>
            <th>ID</th>
            <th>Nama Author</th>
            <th>Negara</th>
            <th>Bio</th>
            <th>Jumlah Buku</th>
        </tr>

        @forelse ($authors as $author)
            <tr>
                <td>{{ $author->id }}</td>
                <td>{{ $author->name }}</td>
                <td>{{ $author->country }}</td>
                <td>{{ $author->bio }}</td>
                <td>{{ $author->books->count() }}</td>
            </tr>
        @empty
            <tr>
                <td colspan="5">Belum ada data author.</td>
            </tr>
        @endforelse
    </table>

    <p><a href="/books">Lihat Daftar Buku</a></p>
</body>
</html>
