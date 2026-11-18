
import { NavLink, useNavigate } from "react-router";
import { useEffect, useState } from "react";

export default function Navbar() {
  const navigate = useNavigate();

  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  });

  useEffect(() => {
    function updateUser() {
      try {
        setUser(JSON.parse(localStorage.getItem("user")));
      } catch {
        setUser(null);
      }
    }

    window.addEventListener("authChanged", updateUser);

    return () => {
      window.removeEventListener("authChanged", updateUser);
    };
  }, []);

  const linkClass = ({ isActive }) =>
    `nav-link ${isActive ? "active fw-bold text-warning" : "text-white"}`;

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("authChanged"));
    navigate("/login");
  }

  return (
    <nav className="navbar navbar-expand navbar-dark bg-primary px-3 px-md-5">
      <div className="container">
        <NavLink className="navbar-brand fw-bold fs-4" to="/">
          BookSales
        </NavLink>

        <div className="navbar-nav ms-auto align-items-center">
          <NavLink className={linkClass} to="/">Home</NavLink>

          <NavLink className={linkClass} to="/book">Book</NavLink>
          <NavLink className={linkClass} to="/about">About</NavLink>
          <NavLink className={linkClass} to="/contact">Contact</NavLink>

          <NavLink className={linkClass} to="/cart">Keranjang</NavLink>

          {user?.role === "user" && (
            <NavLink className={linkClass} to="/my-orders">
              Pesanan Saya
            </NavLink>
          )}

          {user?.role === "admin" && (
            <NavLink className={linkClass} to="/admin">
              Admin
            </NavLink>
          )}

          {!user ? (
            <>
              <NavLink className={linkClass} to="/login">
                Login
              </NavLink>

              <NavLink className={linkClass} to="/register">
                Register
              </NavLink>
            </>
          ) : (
            <>
              <span className="nav-link text-white">
                {user.name || user.email}
              </span>

              <button
                className="btn btn-outline-light btn-sm ms-2"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
