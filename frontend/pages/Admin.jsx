
import { useEffect, useState } from "react";
import {
  getAuthors,
  createAuthor,
  updateAuthor,
  deleteAuthor,
  getGenres,
  createGenre,
  updateGenre,
  deleteGenre,
  getUsers,
  getOrders,
} from "../services/api.js";

export default function Admin() {
  const [authors, setAuthors] = useState([]);
  const [genres, setGenres] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);

  const [authorName, setAuthorName] = useState("");
  const [genreName, setGenreName] = useState("");
  const [genreDescription, setGenreDescription] = useState("");

  const [editingAuthor, setEditingAuthor] = useState(null);
  const [editingGenre, setEditingGenre] = useState(null);

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  let user = null;

  try {
    user = JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    user = null;
  }

  const isAdmin = user?.role === "admin";

  async function fetchData() {
    try {
      setLoading(true);
      setError("");

      const [
        authorData,
        genreData,
        userData,
        orderData,
      ] = await Promise.all([
        getAuthors(),
        getGenres(),
        getUsers(),
        getOrders(),
      ]);

      setAuthors(authorData.data || authorData);
      setGenres(genreData.data || genreData);
      setUsers(userData.data || userData);
      setOrders(orderData.data || orderData);
    } catch (err) {
      setError(err.message || "Gagal mengambil data.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (isAdmin) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, []);

  // KONFIRMASI PEMBAYARAN COD
  async function handleConfirmPayment(orderId) {
    const yakin = window.confirm(
      "Yakin ingin mengonfirmasi bahwa pembayaran COD sudah diterima?"
    );

    if (!yakin) return;

    try {
      setError("");
      setMessage("");

      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://127.0.0.1:8000/api/orders/${orderId}/payment`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Gagal mengonfirmasi pembayaran."
        );
      }

      setMessage("Pembayaran berhasil dikonfirmasi!");
      await fetchData();
    } catch (err) {
      setError(err.message || "Gagal mengonfirmasi pembayaran.");
    }
  }

  // ADMIN MENGUBAH STATUS PESANAN
  async function handleUpdateStatus(orderId, status) {
    try {
      setError("");
      setMessage("");

      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://127.0.0.1:8000/api/orders/${orderId}/status`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Gagal mengubah status pesanan.");
      }

      setMessage("Status pesanan berhasil diperbarui!");
      await fetchData();
    } catch (err) {
      setError(err.message || "Gagal mengubah status pesanan.");
    }
  }
  // AUTHOR
  async function handleAuthorSubmit(event) {
    event.preventDefault();
    setMessage("");
    setError("");

    try {
      if (editingAuthor) {
        await updateAuthor(editingAuthor.id, {
          name: authorName,
        });
        setMessage("Author berhasil diperbarui.");
      } else {
        await createAuthor({ name: authorName });
        setMessage("Author berhasil ditambahkan.");
      }

      setAuthorName("");
      setEditingAuthor(null);
      await fetchData();
    } catch (err) {
      setError(err.message || "Gagal menyimpan Author.");
    }
  }

  function handleEditAuthor(author) {
    setEditingAuthor(author);
    setAuthorName(author.name);
  }

  function cancelEditAuthor() {
    setEditingAuthor(null);
    setAuthorName("");
  }

  async function handleAuthorDelete(id) {
    if (!window.confirm("Yakin ingin menghapus Author ini?")) return;

    try {
      await deleteAuthor(id);
      setMessage("Author berhasil dihapus.");
      await fetchData();
    } catch (err) {
      setError(err.message || "Gagal menghapus Author.");
    }
  }

  // GENRE
  async function handleGenreSubmit(event) {
    event.preventDefault();
    setMessage("");
    setError("");

    const data = {
      name: genreName,
      description: genreDescription,
    };

    try {
      if (editingGenre) {
        await updateGenre(editingGenre.id, data);
        setMessage("Genre berhasil diperbarui.");
      } else {
        await createGenre(data);
        setMessage("Genre berhasil ditambahkan.");
      }

      setGenreName("");
      setGenreDescription("");
      setEditingGenre(null);
      await fetchData();
    } catch (err) {
      setError(err.message || "Gagal menyimpan Genre.");
    }
  }

  function handleEditGenre(genre) {
    setEditingGenre(genre);
    setGenreName(genre.name);
    setGenreDescription(genre.description || "");
  }

  function cancelEditGenre() {
    setEditingGenre(null);
    setGenreName("");
    setGenreDescription("");
  }

  async function handleGenreDelete(id) {
    if (!window.confirm("Yakin ingin menghapus Genre ini?")) return;

    try {
      await deleteGenre(id);
      setMessage("Genre berhasil dihapus.");
      await fetchData();
    } catch (err) {
      setError(err.message || "Gagal menghapus Genre.");
    }
  }

  function formatRupiah(price) {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(Number(price || 0));
  }

  if (!isAdmin) {
    return (
      <section className="container py-5">
        <div className="alert alert-danger">
          Akses ditolak! Halaman ini hanya untuk Admin.
        </div>
      </section>
    );
  }

  return (
    <section className="container py-5">
      <h2 className="fw-bold mb-4">Dashboard Admin</h2>

      {message && (
        <div className="alert alert-success">{message}</div>
      )}

      {error && (
        <div className="alert alert-danger">{error}</div>
      )}

      {loading ? (
        <p>Memuat data...</p>
      ) : (
        <>
          {/* AUTHOR */}
          <div className="card shadow-sm border-0 mb-4">
            <div className="card-body">
              <h4 className="fw-bold mb-3">
                {editingAuthor ? "Edit Author" : "Tambah Author"}
              </h4>

              <form onSubmit={handleAuthorSubmit}>
                <div className="mb-3">
                  <label className="form-label">Nama Author</label>
                  <input
                    type="text"
                    className="form-control"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    required
                  />
                </div>

                <button className="btn btn-primary me-2" type="submit">
                  {editingAuthor ? "Update Author" : "Tambah Author"}
                </button>

                {editingAuthor && (
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={cancelEditAuthor}
                  >
                    Batal
                  </button>
                )}
              </form>

              <hr />

              <h5 className="fw-bold mb-3">Daftar Author</h5>

              <div className="table-responsive">
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>No</th>
                      <th>Nama Author</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {authors.map((author, index) => (
                      <tr key={author.id}>
                        <td>{index + 1}</td>
                        <td>{author.name}</td>
                        <td>
                          <button
                            className="btn btn-warning btn-sm me-2"
                            onClick={() => handleEditAuthor(author)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleAuthorDelete(author.id)}
                          >
                            Hapus
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {authors.length === 0 && (
                  <p className="text-secondary">
                    Belum ada data Author.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* GENRE */}
          <div className="card shadow-sm border-0 mb-4">
            <div className="card-body">
              <h4 className="fw-bold mb-3">
                {editingGenre ? "Edit Genre" : "Tambah Genre"}
              </h4>

              <form onSubmit={handleGenreSubmit}>
                <div className="mb-3">
                  <label className="form-label">Nama Genre</label>
                  <input
                    type="text"
                    className="form-control"
                    value={genreName}
                    onChange={(e) => setGenreName(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Deskripsi Genre</label>
                  <textarea
                    className="form-control"
                    value={genreDescription}
                    onChange={(e) => setGenreDescription(e.target.value)}
                  />
                </div>

                <button className="btn btn-primary me-2" type="submit">
                  {editingGenre ? "Update Genre" : "Tambah Genre"}
                </button>

                {editingGenre && (
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={cancelEditGenre}
                  >
                    Batal
                  </button>
                )}
              </form>

              <hr />

              <h5 className="fw-bold mb-3">Daftar Genre</h5>

              <div className="table-responsive">
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>No</th>
                      <th>Nama Genre</th>
                      <th>Deskripsi</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {genres.map((genre, index) => (
                      <tr key={genre.id}>
                        <td>{index + 1}</td>
                        <td>{genre.name}</td>
                        <td>{genre.description || "-"}</td>
                        <td>
                          <button
                            className="btn btn-warning btn-sm me-2"
                            onClick={() => handleEditGenre(genre)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleGenreDelete(genre.id)}
                          >
                            Hapus
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {genres.length === 0 && (
                  <p className="text-secondary">
                    Belum ada data Genre.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* DAFTAR USER */}
          <div className="card shadow-sm border-0 mb-4">
            <div className="card-body">
              <h4 className="fw-bold mb-3">
                Daftar User Terdaftar
              </h4>

              <div className="table-responsive">
                <table className="table table-bordered table-striped">
                  <thead>
                    <tr>
                      <th>No</th>
                      <th>Nama User</th>
                      <th>Email</th>
                      <th>Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((item, index) => (
                      <tr key={item.id}>
                        <td>{index + 1}</td>
                        <td>{item.name}</td>
                        <td>{item.email}</td>
                        <td>{item.role}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {users.length === 0 && (
                  <p className="text-secondary">
                    Belum ada user terdaftar.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* DAFTAR PESANAN DAN PEMBAYARAN */}
          <div className="card shadow-sm border-0 mb-4">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="fw-bold mb-0">
                  Daftar Pesanan
                </h4>

                <button
                  className="btn btn-outline-primary btn-sm"
                  onClick={fetchData}
                >
                  Refresh
                </button>
              </div>

              <div className="table-responsive">
                <table className="table table-bordered table-striped align-middle">
                  <thead>
                    <tr>
                      <th>No</th>
                      <th>Nama Pemesan</th>
                      <th>Email</th>
                      <th>Detail Buku</th>
                      <th>Total Harga</th>
                      <th>Alamat Pengiriman</th>
                      <th>Status Pesanan</th>
                      <th>Metode Pembayaran</th>
                      <th>Status Pembayaran</th>
                      <th>Aksi Pembayaran</th>
                      <th>Tanggal Pesanan</th>
                    </tr>
                  </thead>

                  <tbody>
                    {orders.map((order, index) => (
                      <tr key={order.id}>
                        <td>{index + 1}</td>

                        <td>{order.user?.name || "-"}</td>

                        <td>{order.user?.email || "-"}</td>

                        <td>
                          {order.items?.length > 0 ? (
                            order.items.map((item) => (
                              <div key={item.id} className="mb-2">
                                <strong>
                                  {item.book?.title || "Buku tidak ditemukan"}
                                </strong>
                                <br />
                                Jumlah: {item.quantity}
                                <br />
                                Harga: {formatRupiah(item.price)}
                              </div>
                            ))
                          ) : (
                            "-"
                          )}
                        </td>

                        <td className="fw-bold">
                          {formatRupiah(order.total_price)}
                        </td>

                        <td>{order.shipping_address || "-"}</td>

                        <td>
                          <select
  className="form-select form-select-sm"
  style={{ minWidth: "130px", cursor: "pointer" }}
  value={order.status || "pending"}
  onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
>
  <option value="pending">Pending</option>
  <option value="diproses">Diproses</option>
  <option value="dikirim">Dikirim</option>
  <option value="selesai">Selesai</option>
</select>
                        </td>

                        <td>
                          {order.payment_method === "cod"
                            ? "Cash on Delivery (COD)"
                            : order.payment_method === "midtrans"
                              ? "Virtual Account (Midtrans)"
                            : order.payment_method || "-"}
                        </td>

                        <td>
                          <span
                            className={`badge ${
                              order.payment_status === "paid"
                                ? "bg-success"
                                : order.payment_status === "pending" ||
                                    order.payment_status === "unpaid"
                                  ? "bg-warning text-dark"
                                  : "bg-secondary"
                            }`}
                          >
                            {order.payment_status === "paid"
                              ? "Sudah Dibayar"
                              : order.payment_status === "pending"
                                ? "Menunggu Pembayaran"
                                : order.payment_status === "unpaid"
                                  ? "Belum Dibayar"
                                  : order.payment_status || "Tidak diketahui"}
                          </span>
                        </td>

                        <td>
                          {order.payment_status === "paid" ? (
                            <span className="text-success fw-bold">
                              Lunas
                            </span>
                          ) : order.payment_method === "midtrans" ? (
                            <span className="text-secondary">
                              Dikonfirmasi otomatis
                            </span>
                          ) : (
                            <button
                              className="btn btn-success btn-sm"
                              onClick={() => handleConfirmPayment(order.id)}
                            >
                              Tandai Sudah Dibayar
                            </button>
                          )}
                        </td>

                        <td>
                          {order.created_at
                            ? new Date(order.created_at).toLocaleDateString(
                                "id-ID"
                              )
                            : "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {orders.length === 0 && (
                  <p className="text-secondary">
                    Belum ada pesanan masuk.
                  </p>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
