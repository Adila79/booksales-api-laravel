
import { Link } from "react-router";
import { useState } from "react";
import { booksData } from "../Utils/books.js";
import BookCard from "../components/BookCard.jsx";

export default function Home() {
  const [cartMessage, setCartMessage] = useState("");

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
    <>
      <section className="hero py-5">
        <div className="container py-3 py-md-5">
          <div className="row align-items-center">
            <div className="col-lg-8">
              <span className="badge rounded-pill text-bg-warning mb-3">
                Temukan bacaan berikutnya
              </span>

              <h1 className="display-4 fw-bold text-white">
                Satu buku, banyak cerita.
              </h1>

              <p className="lead text-white-50 mt-3">
                Jelajahi koleksi buku pilihan untuk menemani perjalanan
                dan menambah wawasanmu.
              </p>

              <Link
                to="/book"
                className="btn btn-warning btn-lg mt-2 fw-semibold"
              >
                Lihat Semua Buku
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="container py-5">
        <div className="d-flex flex-wrap justify-content-between align-items-end gap-2 mb-4">
          <div>
            <p className="text-primary fw-semibold mb-1">
              KOLEKSI KAMI
            </p>
            <h2 className="fw-bold mb-0">Buku Pilihan</h2>
          </div>

          <span className="text-secondary">
            {booksData.length} buku tersedia
          </span>
        </div>

        {cartMessage && (
          <div className="alert alert-success" role="alert">
            {cartMessage}
          </div>
        )}

        <div className="row g-4">
          {booksData.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      </section>
    </>
  );
}
