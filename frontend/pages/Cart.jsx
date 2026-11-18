import { useState } from "react";
import { Link } from "react-router";
import { createOrder } from "../services/api.js";
import { bankList, paymentInstructions } from "../Utils/paymentInstructions.js";

export default function Cart() {
  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("cart") || "[]");
    } catch {
      return [];
    }
  });

  const [address, setAddress] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("midtrans");
  const [selectedBank, setSelectedBank] = useState("bca");
  const [checkoutOrder, setCheckoutOrder] = useState(null);
  const [copiedKey, setCopiedKey] = useState("");
  const [activeInstructionTab, setActiveInstructionTab] = useState(0);

  function updateCart(newCart) {
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  }

  function updateQuantity(id, quantity) {
    if (quantity < 1) return;

    updateCart(
      cart.map((item) =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  }

  function removeItem(id) {
    updateCart(cart.filter((item) => item.id !== id));
  }

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  function formatRupiah(price) {
    return Number(price || 0).toLocaleString("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    });
  }

  async function handleCopy(text, key) {
    if (!text) return;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(""), 2500);
    } catch {
      setCopiedKey("error");
      setTimeout(() => setCopiedKey(""), 2500);
    }
  }

  async function handleCheckout() {
    setError("");
    setMessage("");
    setCheckoutOrder(null);
    setCopiedKey("");
    setActiveInstructionTab(0);

    if (!localStorage.getItem("token")) {
      setError("Silakan login terlebih dahulu sebelum checkout.");
      return;
    }

    if (!address.trim()) {
      setError("Alamat pengiriman wajib diisi.");
      return;
    }

    if (cart.length === 0) {
      setError("Keranjang masih kosong.");
      return;
    }

    setLoading(true);

    try {
      const items = cart.map((item) => ({
        book_id: item.id,
        quantity: item.quantity,
      }));

      const result = await createOrder(address, items, {
        paymentMethod,
        bank: paymentMethod === "midtrans" ? selectedBank : null,
      });

      updateCart([]);
      setAddress("");
      setCheckoutOrder(result.data);

      setMessage(
        paymentMethod === "midtrans"
          ? "Pesanan berhasil dibuat! Silakan lakukan pembayaran melalui Virtual Account berikut."
          : "Pesanan berhasil dibuat! Terima kasih sudah berbelanja (COD)."
      );
    } catch (err) {
      setError(err.message || "Checkout gagal.");
    } finally {
      setLoading(false);
    }
  }

  const currentVaBank = checkoutOrder?.virtual_account_bank || selectedBank;
  const currentInstructions = paymentInstructions[currentVaBank] || paymentInstructions.bca;
  const isMandiri = currentVaBank === "mandiri";
  const billerCode = checkoutOrder?.midtrans_payment_data?.biller_code || "70012";
  const vaNumber = checkoutOrder?.virtual_account_number || checkoutOrder?.midtrans_payment_data?.va_number;

  return (
    <section className="container py-5">
      <h1 className="fw-bold mb-4">Keranjang Belanja</h1>

      {message && (
        <div className="alert alert-success">
          <p className="fw-bold mb-2">{message}</p>

          {checkoutOrder?.payment_method === "midtrans" && (
            <div className="card border-0 shadow-sm mt-3 bg-white text-dark">
              <div className="card-header bg-primary text-white py-3 d-flex justify-content-between align-items-center">
                <span className="fw-bold fs-6">
                  Pembayaran Virtual Account Midtrans
                </span>
                <span className="badge bg-warning text-dark text-uppercase">
                  Menunggu Pembayaran
                </span>
              </div>

              <div className="card-body p-4">
                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <small className="text-secondary d-block mb-1">Bank Tujuan</small>
                    <span className="badge bg-light text-dark border fs-6 px-3 py-2 text-uppercase">
                      {currentInstructions.bankName}
                    </span>
                  </div>

                  <div className="col-md-6">
                    <small className="text-secondary d-block mb-1">Total Pembayaran</small>
                    <h4 className="fw-bold text-primary mb-0">
                      {formatRupiah(checkoutOrder.total_price)}
                    </h4>
                  </div>
                </div>

                {isMandiri ? (
                  <div className="bg-light p-3 rounded border mb-4">
                    <div className="row g-3">
                      <div className="col-md-6">
                        <small className="text-secondary fw-semibold">Kode Perusahaan (Biller Code)</small>
                        <div className="d-flex align-items-center gap-2 mt-1">
                          <code className="fs-5 fw-bold text-dark">{billerCode}</code>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => handleCopy(billerCode, "biller")}
                          >
                            {copiedKey === "biller" ? "Tersalin!" : "Salin"}
                          </button>
                        </div>
                      </div>

                      <div className="col-md-6">
                        <small className="text-secondary fw-semibold">Kode Pembayaran (Bill Key)</small>
                        <div className="d-flex align-items-center gap-2 mt-1">
                          <code className="fs-5 fw-bold text-primary">{vaNumber || "-"}</code>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => handleCopy(vaNumber, "billkey")}
                          >
                            {copiedKey === "billkey" ? "Tersalin!" : "Salin Nomor"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-light p-3 rounded border mb-4">
                    <small className="text-secondary fw-semibold d-block">Nomor Virtual Account</small>
                    <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mt-2">
                      <code className="fs-4 fw-bold text-primary tracking-wide">
                        {vaNumber || "Memuat nomor VA..."}
                      </code>
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => handleCopy(vaNumber, "va")}
                        disabled={!vaNumber}
                      >
                        {copiedKey === "va" ? "Nomor VA Tersalin!" : "Salin Nomor VA"}
                      </button>
                    </div>
                  </div>
                )}

                {/* Petunjuk Pembayaran */}
                <div className="mt-4">
                  <h6 className="fw-bold mb-3">Petunjuk Cara Pembayaran:</h6>

                  <ul className="nav nav-pills mb-3" role="tablist">
                    {currentInstructions.channels.map((chan, idx) => (
                      <li className="nav-item" key={chan.channel}>
                        <button
                          type="button"
                          className={`nav-link btn-sm ${activeInstructionTab === idx ? "active" : ""}`}
                          onClick={() => setActiveInstructionTab(idx)}
                        >
                          {chan.channel}
                        </button>
                      </li>
                    ))}
                  </ul>

                  <div className="border rounded p-3 bg-white">
                    <ol className="mb-0 ps-3">
                      {currentInstructions.channels[activeInstructionTab]?.steps.map((step, sIdx) => (
                        <li key={sIdx} className="mb-1 text-secondary">
                          {step}
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-top d-flex justify-content-between align-items-center flex-wrap gap-2">
                  <small className="text-muted">
                    Pesanan #{checkoutOrder.id} &bull; Status akan otomatis terkonfirmasi setelah Anda membayar.
                  </small>
                  <Link to="/my-orders" className="btn btn-outline-secondary btn-sm">
                    Buka Halaman Pesanan Saya &rarr;
                  </Link>
                </div>
              </div>
            </div>
          )}

          {checkoutOrder?.payment_method === "cod" && (
            <div className="mt-3">
              <Link to="/my-orders" className="alert-link">
                Lihat detail pesanan di halaman Pesanan Saya &rarr;
              </Link>
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="alert alert-danger">{error}</div>
      )}

      {cart.length === 0 ? (
        <div className="text-center py-5">
          <h4>Keranjang masih kosong</h4>
          <p className="text-secondary">
            Yuk, pilih buku favoritmu terlebih dahulu.
          </p>
          <Link to="/book" className="btn btn-primary">
            Lihat Daftar Buku
          </Link>
        </div>
      ) : (
        <div className="row g-4">
          <div className="col-lg-8">
            {cart.map((item) => (
              <div
                key={item.id}
                className="card border-0 shadow-sm mb-3"
              >
                <div className="card-body d-flex gap-3 align-items-center">
                  <img
                    src={item.image}
                    alt={item.title}
                    style={{
                      width: "85px",
                      height: "110px",
                      objectFit: "cover",
                    }}
                  />

                  <div className="flex-grow-1">
                    <h5 className="fw-bold">{item.title}</h5>
                    <p className="text-secondary mb-1">
                      {formatRupiah(item.price)}
                    </p>

                    <div className="d-flex align-items-center gap-2">
                      <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                      >
                        -
                      </button>

                      <span>{item.quantity}</span>

                      <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                      >
                        +
                      </button>

                      <button
                        className="btn btn-sm btn-outline-danger ms-2"
                        onClick={() => removeItem(item.id)}
                      >
                        Hapus
                      </button>
                    </div>
                  </div>

                  <strong>
                    {formatRupiah(item.price * item.quantity)}
                  </strong>
                </div>
              </div>
            ))}
          </div>

          <div className="col-lg-4">
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4">
                <h4 className="fw-bold mb-3">Ringkasan Pesanan</h4>

                <div className="d-flex justify-content-between mb-3">
                  <span>Total</span>
                  <strong className="text-primary">
                    {formatRupiah(total)}
                  </strong>
                </div>

                <hr />

                <label className="form-label fw-semibold">
                  Alamat Pengiriman
                </label>

                <textarea
                  className="form-control mb-3"
                  rows="3"
                  placeholder="Masukkan alamat pengiriman lengkap..."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />

                <label className="form-label fw-semibold">
                  Metode Pembayaran
                </label>

                <select
                  className="form-select mb-3"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <option value="midtrans">Virtual Account (Midtrans)</option>
                  <option value="cod">Cash on Delivery (COD)</option>
                </select>

                {paymentMethod === "midtrans" && (
                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Pilih Bank Virtual Account
                    </label>
                    <select
                      className="form-select"
                      value={selectedBank}
                      onChange={(e) => setSelectedBank(e.target.value)}
                    >
                      {bankList.map((b) => (
                        <option key={b.id} value={b.code}>
                          {b.name}
                        </option>
                      ))}
                    </select>
                    <small className="text-muted d-block mt-1">
                      Mendukung BCA, BNI, BRI, Mandiri, Permata, & CIMB Niaga
                    </small>
                  </div>
                )}

                <button
                  className="btn btn-primary w-100 py-2 fw-semibold"
                  onClick={handleCheckout}
                  disabled={loading}
                >
                  {loading
                    ? "Memproses Pesanan..."
                    : paymentMethod === "midtrans"
                      ? "Buat Pesanan & Bayar via VA"
                      : "Pesan Sekarang (COD)"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
