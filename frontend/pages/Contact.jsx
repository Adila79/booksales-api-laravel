export default function Contact() {
  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <span className="badge bg-primary mb-3">Hubungi Kami</span>
        <h1 className="fw-bold">Contact Admin</h1>
        <p className="text-muted">
          Ada pertanyaan atau membutuhkan bantuan? Hubungi admin BookStore.
        </p>
      </div>

      <div className="row justify-content-center g-4">
        <div className="col-md-5">
          <div className="card border-0 shadow-sm h-100 p-4 text-center">
            <div className="display-4 mb-3">WhatsApp</div>
            <h4 className="fw-bold">Hubungi via WhatsApp</h4>
            <p className="text-muted">+62 858-8176-1923</p>
            <a
              href="https://wa.me/6285881761923"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-success mt-auto"
            >
              Chat Admin
            </a>
          </div>
        </div>

        <div className="col-md-5">
          <div className="card border-0 shadow-sm h-100 p-4 text-center">
            <div className="display-4 mb-3">Email</div>
            <h4 className="fw-bold">Hubungi via Email</h4>
            <p className="text-muted">alipoce1@gmail.com</p>
            <a
              href="mailto:alipoce1@gmail.com"
              className="btn btn-primary mt-auto"
            >
              Kirim Email
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
