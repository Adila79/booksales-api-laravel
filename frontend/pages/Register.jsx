
import { useState } from "react";
import { registerUser } from "../services/api.js";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setError("");

    try {
      const result = await registerUser(name, email, password);

      setMessage(result.message || "Registrasi berhasil!");

      setName("");
      setEmail("");
      setPassword("");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <section className="container py-5">
      <div
        className="card shadow-sm border-0 mx-auto"
        style={{ maxWidth: "450px" }}
      >
        <div className="card-body p-4">
          <h2 className="fw-bold mb-2">Daftar Akun</h2>
          <p className="text-secondary">
            Buat akun untuk menggunakan BookSales.
          </p>

          {message && (
            <div className="alert alert-success">{message}</div>
          )}

          {error && (
            <div className="alert alert-danger">{error}</div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Nama</label>
              <input
                type="text"
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={8}
                required
              />
              <small className="text-secondary">
                Minimal 8 karakter.
              </small>
            </div>

            <button type="submit" className="btn btn-primary w-100">
              Daftar
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
