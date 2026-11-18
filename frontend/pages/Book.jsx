
import { useEffect, useState } from "react";
import { getBooks } from "../services/api.js";
import { booksData } from "../Utils/books.js";
import BookCard from "../components/BookCard.jsx";

export default function Book() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [cartMessage, setCartMessage] = useState("");

  useEffect(() => {
    async function fetchBooks() {
      try {
        const data = await getBooks();

        const formattedBooks = data.map((book) => {
          const localBook = booksData.find(
            (item) =>
              item.title.toLowerCase() === book.title.toLowerCase()
          );

          return {
            id: book.id,
            title: book.title,
            author: book.author?.name || "Tidak diketahui",
            price: Number(book.price) || 0,
            category: localBook?.category || "Umum",
            stock: localBook?.stock ?? 0,
            image: localBook?.image || "",
          };
        });

        setBooks(formattedBooks);
      } catch (error) {
        setMessage(error.message || "Gagal mengambil daftar buku.");
      } finally {
        setLoading(false);
      }
    }

    fetchBooks();
  }, []);

  function handleAddToCart(book) {
    const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");

    const existingBook = savedCart.find(
      (item) => item.id === book.id
    );

    let updatedCart;

    if (existingBook) {
      updatedCart = savedCart.map((item) =>
        item.id === book.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      updatedCart = [
        ...savedCart,
        { ...book, quantity: 1 },
      ];
    }

    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setCartMessage(`${book.title} berhasil ditambahkan ke keranjang!`);
  }

  return (
    <section className="container py-5">
      <div className="mb-4">
        <p className="text-primary fw-semibold mb-1">KATALOG</p>
        <h1 className="fw-bold">Daftar Buku</h1>
        <p className="text-secondary">
          Lihat koleksi buku yang tersedia di BookStore.
        </p>
      </div>

      {cartMessage && (
        <div className="alert alert-success" role="alert">
          {cartMessage}
        </div>
      )}

      {loading && (
        <p className="text-secondary">Memuat daftar buku...</p>
      )}

      {message && (
        <div className="alert alert-danger" role="alert">
          {message}
        </div>
      )}

      {!loading && !message && (
        <>
          <div className="d-flex justify-content-between align-items-end mb-3">
            <h2 className="h3 fw-bold mb-0">Semua Buku</h2>
            <span className="text-secondary">{books.length} buku</span>
          </div>

          {books.length === 0 ? (
            <p className="text-secondary">Belum ada buku tersedia.</p>
          ) : (
            <div className="row g-4">
              {books.map((book) => (
                <BookCard
                  key={book.id}
                  book={book}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
}
