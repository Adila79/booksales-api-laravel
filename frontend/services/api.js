
const API_URL = "http://127.0.0.1:8000/api";

// Mengambil daftar Buku dari Laravel
export async function getBooks() {
  const response = await fetch(`${API_URL}/books`, {
    headers: { Accept: "application/json" },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Gagal mengambil data buku");
  }

  return result.data;
}

// Mengambil data Author
export async function getAuthors() {
  const response = await fetch(`${API_URL}/authors`);
  if (!response.ok) throw new Error("Gagal mengambil data Author");

  const result = await response.json();
  return result.data;
}

// Login Admin dan User
export async function loginUser(email, password) {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const result = await response.json();
  if (!response.ok) throw new Error(result.message || "Login gagal");

  return result;
}

// Menambahkan data Author
export async function createAuthor(authorData) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/authors`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(authorData),
  });

  const result = await response.json();
  if (!response.ok) throw new Error(result.message || "Gagal menambahkan Author");

  return result;
}

// Mengambil data Genre
export async function getGenres() {
  const response = await fetch(`${API_URL}/genres`);
  if (!response.ok) throw new Error("Gagal mengambil data Genre");

  const result = await response.json();
  return result.data;
}

// Menambahkan data Genre
export async function createGenre(genreData) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/genres`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(genreData),
  });

  const result = await response.json();
  if (!response.ok) throw new Error(result.message || "Gagal menambahkan Genre");

  return result;
}

// Mengubah data Author
export async function updateAuthor(id, authorData) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/authors/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(authorData),
  });

  const result = await response.json();
  if (!response.ok) throw new Error(result.message || "Gagal mengubah Author");

  return result;
}

// Menghapus data Author
export async function deleteAuthor(id) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/authors/${id}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error("Gagal menghapus Author");

  return true;
}

// Mengubah data Genre
export async function updateGenre(id, genreData) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/genres/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(genreData),
  });

  const result = await response.json();
  if (!response.ok) throw new Error(result.message || "Gagal mengubah Genre");

  return result;
}

// Menghapus data Genre
export async function deleteGenre(id) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/genres/${id}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error("Gagal menghapus Genre");

  return true;
}

// Registrasi User
export async function registerUser(name, email, password) {
  const response = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ name, email, password }),
  });

  const result = await response.json();

  if (!response.ok) {
    const validationErrors = result.errors
      ? Object.values(result.errors).flat().join(", ")
      : result.message;

    throw new Error(validationErrors || "Registrasi gagal");
  }

  return result;
}

// Mengambil daftar User untuk Admin
export async function getUsers() {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/users`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });

  const result = await response.json();
  if (!response.ok) throw new Error(result.message || "Gagal mengambil daftar user");

  return result;
}

// Mengambil daftar Pesanan untuk Admin
export async function getOrders() {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/orders`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });

  const result = await response.json();
  if (!response.ok) throw new Error(result.message || "Gagal mengambil daftar pesanan");

  return result.data;
}

// Mengambil riwayat pesanan User yang sedang login
export async function getMyOrders() {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Silakan login terlebih dahulu.");
  }

  const response = await fetch(`${API_URL}/my-orders`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Gagal mengambil riwayat pesanan");
  }

  return result.data;
}

// Membuat pesanan / Checkout
export async function createOrder(
  shippingAddress,
  items,
  { paymentMethod = "cod", bank = null } = {}
) {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Silakan login terlebih dahulu.");
  }

  const payload = {
    shipping_address: shippingAddress,
    payment_method: paymentMethod,
    items: items.map((item) => ({
      book_id: item.book_id,
      quantity: item.quantity,
    })),
  };

  if (bank) {
    payload.bank = bank;
  }

  const response = await fetch(`${API_URL}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const result = await response.json();

  if (!response.ok) {
    const validationErrors = result.errors
      ? Object.values(result.errors).flat().join(", ")
      : result.message;

    throw new Error(validationErrors || "Checkout gagal");
  }

  return result;
}
