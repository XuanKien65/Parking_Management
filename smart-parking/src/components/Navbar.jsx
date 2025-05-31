import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaParking, FaUser, FaSignOutAlt, FaSignInAlt, FaUserPlus } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import "./layout.css";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">
          <FaParking className="navbar-icon" />
          Bãi Đỗ Xe PTIT
        </Link>
      </div>
      <ul className="navbar-links">
        {user ? (
          <>
            <li className="user-info">
              <FaUser className="user-icon" />
              <span>{user.name}</span>
            </li>
            {user.role === "admin" ? (
              <li>
                <Link to="/admin">
                  <FaUser /> Quản lý
                </Link>
              </li>
            ) : (
              <li>
                <Link to="/booking">Đặt chỗ</Link>
              </li>
            )}
            <li>
              <button className="logout-btn" onClick={handleLogout}>
                <FaSignOutAlt className="logout-icon" />
                <span>Đăng xuất</span>
              </button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/login">
                <FaSignInAlt /> Đăng nhập
              </Link>
            </li>
            <li>
              <Link to="/register">
                <FaUserPlus /> Đăng ký
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
