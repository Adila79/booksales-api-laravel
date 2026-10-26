
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
        </tr>

        @foreach ($authors as $author)
            <tr>
                <td>{{ $author['id'] }}</td>
                <td>{{ $author['name'] }}</td>
                <td>{{ $author['country'] }}</td>
            </tr>
        @endforeach
    </table>

    <p><a href="/genres">Lihat Daftar Genre</a></p>
</body>
</html>
