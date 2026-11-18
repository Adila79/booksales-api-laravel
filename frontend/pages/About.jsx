export default function About() {
  return (
    <div className="container py-5">
      <div className="row align-items-center g-5">
        <div className="col-lg-6">
          <span className="badge bg-primary mb-3">Tentang Kami</span>

          <h1 className="fw-bold mb-4">
            Selamat Datang di BookStore
          </h1>

          <p className="text-muted fs-5">
            BookStore adalah toko buku online yang menyediakan berbagai
            pilihan buku berkualitas untuk menemani perjalanan belajar,
            bekerja, dan mengembangkan diri.
          </p>

          <p className="text-muted">
            Kami percaya bahwa buku merupakan jendela dunia. Melalui
            BookStore, kami ingin membantu setiap orang menemukan buku
            favoritnya dengan mudah, praktis, dan nyaman.
          </p>
        </div>

        <div className="col-lg-6">
          <div className="bg-light rounded-4 p-5 text-center">
            <div style={{ fontSize: "100px" }}>&#128218;</div>
            <h3 className="fw-bold mt-3">BookStore</h3>
            <p className="text-muted mb-0">
              Temukan buku favoritmu, buka wawasan baru.
            </p>
          </div>
        </div>
      </div>

      <hr className="my-5" />

      <div className="text-center mb-4">
        <h2 className="fw-bold">Visi dan Misi Kami</h2>
        <p className="text-muted">
          Komitmen kami untuk menghadirkan pengalaman membaca terbaik.
        </p>
      </div>

      <div className="row g-4">
        <div className="col-md-6">
          <div className="card border-0 shadow-sm h-100 p-4">

            <h4 className="fw-bold">Visi</h4>
            <p className="text-muted mb-0">
              Menjadi toko buku online yang memudahkan masyarakat
              mendapatkan buku berkualitas dan meningkatkan minat baca.
            </p>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card border-0 shadow-sm h-100 p-4">

            <h4 className="fw-bold">Misi</h4>
            <p className="text-muted mb-0">
              Menyediakan beragam pilihan buku, memberikan pelayanan
              yang mudah dan nyaman, serta mendukung budaya membaca.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
