import { useEffect, useState } from "react";
import { getMyOrders } from "../services/api.js";
import { paymentInstructions } from "../Utils/paymentInstructions.js";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copiedKey, setCopiedKey] = useState("");
  const [expandedInstructions, setExpandedInstructions] = useState({});

  useEffect(() => {
    async function loadOrders() {
      try {
        const data = await getMyOrders();
        setOrders(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadOrders();
  }, []);

  function formatRupiah(value) {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(value || 0);
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

  function toggleInstruction(orderId) {
    setExpandedInstructions((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  }

  function statusBadge(status) {
    const colors = {
      pending: "warning",
      diproses: "primary",
      processing: "primary",
      dikirim: "info",
      completed: "success",
      selesai: "success",
      cancelled: "danger",
      batal: "danger",
    };

    return (
      <span className={`badge text-bg-${colors[status] || "secondary"} text-uppercase`}>
        {status}
      </span>
    );
  }

  function paymentStatusBadge(status) {
    const statuses = {
      paid: { label: "Sudah Dibayar", color: "success" },
      pending: { label: "Menunggu Pembayaran", color: "warning" },
      unpaid: { label: "Belum Dibayar", color: "warning" },
      expired: { label: "Kedaluwarsa", color: "secondary" },
      cancelled: { label: "Dibatalkan", color: "danger" },
      failed: { label: "Gagal", color: "danger" },
    };

    const paymentStatus = statuses[status] || {
      label: status || "Tidak diketahui",
      color: "secondary",
    };

    return (
      <span className={`badge text-bg-${paymentStatus.color}`}>
        {paymentStatus.label}
      </span>
    );
  }

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary me-2" role="status"></div>
        Memuat riwayat pesanan...
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h2 className="fw-bold mb-4">Riwayat Pesanan Saya</h2>

      {orders.length === 0 ? (
        <div className="alert alert-info">
          Kamu belum memiliki pesanan.
        </div>
      ) : (
        orders.map((order) => {
          const isMidtrans = order.payment_method === "midtrans" || order.payment_method === "midtrans_va";
          const bankKey = (order.virtual_account_bank || order.midtrans_payment_data?.va_bank || "bca").toLowerCase();
          const instructions = paymentInstructions[bankKey] || paymentInstructions.bca;
          const isMandiri = bankKey === "mandiri";
          const billerCode = order.midtrans_payment_data?.biller_code || "70012";
          const vaNumber = order.virtual_account_number || order.midtrans_payment_data?.va_number || order.midtrans_payment_data?.bill_key;
          const isPending = order.payment_status === "pending" || order.payment_status === "unpaid";
          const isPaid = order.payment_status === "paid";

          return (
            <div className="card shadow-sm border-0 mb-4" key={order.id}>
              <div className="card-body p-4">
                <div className="d-flex justify-content-between flex-wrap gap-2 mb-3">
                  <div>
                    <h5 className="fw-bold mb-1">
                      Pesanan #{order.id}
                    </h5>
                    <small className="text-secondary">
                      {new Date(order.created_at).toLocaleString("id-ID")}
                    </small>
                  </div>

                  {statusBadge(order.status)}
                </div>

                <hr />

                <h6 className="fw-bold">Buku yang dipesan:</h6>

                {order.items?.map((item) => (
                  <div
                    className="d-flex justify-content-between border-bottom py-2"
                    key={item.id}
                  >
                    <div>
                      <div className="fw-semibold">
                        {item.book?.title || "Buku tidak tersedia"}
                      </div>
                      <small className="text-secondary">
                        {item.quantity} x {formatRupiah(item.price)}
                      </small>
                    </div>

                    <div className="fw-semibold">
                      {formatRupiah(item.price * item.quantity)}
                    </div>
                  </div>
                ))}

                <div className="mt-3">
                  <div className="text-secondary small">
                    Alamat Pengiriman
                  </div>
                  <p className="mb-2">{order.shipping_address}</p>
                </div>

                {/* Box Informasi Pembayaran */}
                <div className="bg-light rounded p-3 mb-3 border">
                  <h6 className="fw-bold mb-2">
                    Informasi Pembayaran
                  </h6>

                  <div className="d-flex justify-content-between mb-2">
                    <span>Metode Pembayaran</span>
                    <span className="fw-semibold">
                      {order.payment_method === "cod"
                        ? "Cash on Delivery (COD)"
                        : isMidtrans
                          ? `Virtual Account (${instructions.bankName})`
                          : order.payment_method || "-"}
                    </span>
                  </div>

                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span>Status Pembayaran</span>
                    {paymentStatusBadge(order.payment_status)}
                  </div>

                  {isMidtrans && (
                    <div className="mt-3 pt-3 border-top">
                      {isPaid ? (
                        <div className="alert alert-success mb-0 py-2">
                          &#10003; Pembayaran telah berhasil diverifikasi oleh sistem Midtrans.
                        </div>
                      ) : (
                        <div>
                          {isMandiri ? (
                            <div className="row g-2 mb-3">
                              <div className="col-sm-6">
                                <small className="text-secondary d-block">Kode Perusahaan (Biller Code):</small>
                                <div className="d-flex align-items-center gap-2 mt-1">
                                  <code className="fs-6 fw-bold">{billerCode}</code>
                                  <button
                                    type="button"
                                    className="btn btn-outline-primary btn-sm py-0 px-2"
                                    onClick={() => handleCopy(billerCode, `biller-${order.id}`)}
                                  >
                                    {copiedKey === `biller-${order.id}` ? "Tersalin!" : "Salin"}
                                  </button>
                                </div>
                              </div>
                              <div className="col-sm-6">
                                <small className="text-secondary d-block">Kode Pembayaran (Bill Key):</small>
                                <div className="d-flex align-items-center gap-2 mt-1">
                                  <code className="fs-6 fw-bold text-primary">{vaNumber || "-"}</code>
                                  <button
                                    type="button"
                                    className="btn btn-outline-primary btn-sm py-0 px-2"
                                    onClick={() => handleCopy(vaNumber, `billkey-${order.id}`)}
                                  >
                                    {copiedKey === `billkey-${order.id}` ? "Tersalin!" : "Salin"}
                                  </button>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
                              <div>
                                <small className="text-secondary d-block">Nomor Virtual Account:</small>
                                <code className="fs-5 fw-bold text-primary">
                                  {vaNumber || "Memuat..."}
                                </code>
                              </div>

                              <button
                                type="button"
                                className="btn btn-sm btn-primary"
                                onClick={() => handleCopy(vaNumber, `va-${order.id}`)}
                                disabled={!vaNumber}
                              >
                                {copiedKey === `va-${order.id}` ? "Nomor Tersalin!" : "Salin Nomor VA"}
                              </button>
                            </div>
                          )}

                          {isPending && (
                            <div className="mt-2">
                              <button
                                type="button"
                                className="btn btn-outline-secondary btn-sm"
                                onClick={() => toggleInstruction(order.id)}
                              >
                                {expandedInstructions[order.id]
                                  ? "Tutup Petunjuk Pembayaran"
                                  : "Lihat Petunjuk Pembayaran"}
                              </button>

                              {expandedInstructions[order.id] && (
                                <div className="mt-3 p-3 bg-white rounded border">
                                  <h6 className="fw-bold mb-2">
                                    Cara Pembayaran {instructions.bankName}:
                                  </h6>
                                  {instructions.channels.map((chan) => (
                                    <div key={chan.channel} className="mb-2">
                                      <strong>{chan.channel}:</strong>
                                      <ol className="ps-3 mb-1 small text-secondary">
                                        {chan.steps.map((st, i) => (
                                          <li key={i}>{st}</li>
                                        ))}
                                      </ol>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {order.payment_method === "cod" && (
                    <small className="text-secondary d-block mt-2">
                      Silakan bayar pesanan secara tunai saat buku diterima.
                    </small>
                  )}
                </div>

                <div className="d-flex justify-content-between align-items-center border-top pt-3">
                  <span className="fw-bold">Total Pembayaran</span>
                  <h5 className="fw-bold text-primary mb-0">
                    {formatRupiah(order.total_price)}
                  </h5>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
