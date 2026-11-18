
export default function BookCard({ book, onAddToCart }) {
  return (
    <div className="col-sm-6 col-lg-4">
      <article className="card h-100 border-0 shadow-sm book-card">
        <div className="book-cover d-flex align-items-center justify-content-center">
          <img
            src={book.image}
            alt={`Cover buku ${book.title}`}
            className="book-cover-image"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        </div>

        <div className="card-body d-flex flex-column">
          <span className="badge text-bg-primary align-self-start mb-2">
            {book.category}
          </span>

          <h2 className="h5 card-title">{book.title}</h2>
          <p className="text-secondary mb-2">oleh {book.author}</p>

          <div className="mt-auto">
            <p className="fs-5 fw-bold text-primary mb-1">
              {book.price.toLocaleString("id-ID", {
                style: "currency",
                currency: "IDR",
                maximumFractionDigits: 0,
              })}
            </p>

            <small className="text-secondary d-block mb-3">
              Stok: {book.stock}
            </small>

            <button
              type="button"
              className="btn btn-primary w-100"
              onClick={() => onAddToCart(book)}
            >
              <i className="bi bi-cart-plus me-2"></i>
              Tambah ke Keranjang
            </button>
          </div>
        </div>
      </article>
    </div>
  );
}
