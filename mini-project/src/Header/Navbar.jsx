import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css";

function Navbar({ items = [], onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <nav className="navbar">
        <span
          className="navbar-brand"
          onClick={() => navigate("/")}
          style={{ cursor: "pointer" }}
        >
          SYNAP
        </span>

        <ul className="navbar-links">
          {items.map((item) => (
            <li key={item.path}>
              <button
                type="button"
                className={location.pathname === item.path ? "active" : ""}
                onClick={() => navigate(item.path)}
              >
                {item.label}
              </button>
            </li>
          ))}

          <li>
            <button
              type="button"
              className="navbar-logout"
              onClick={onLogout}
            >
              Logout
            </button>
          </li>
        </ul>

        <button
          type="button"
          className="hamburger"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          <span />
          <span />
          <span />
        </button>
      </nav>

      {menuOpen && (
        <div className="mobile-menu">
          {items.map((item) => (
            <button
              key={item.path}
              type="button"
              className={location.pathname === item.path ? "active" : ""}
              onClick={() => {
                navigate(item.path);
                setMenuOpen(false);
              }}
            >
              {item.label}
            </button>
          ))}

          <button
            type="button"
            className="mobile-logout"
            onClick={() => {
              if (onLogout) onLogout();
              setMenuOpen(false);
            }}
          >
            Logout
          </button>
        </div>
      )}
    </>
  );
}

export default Navbar;