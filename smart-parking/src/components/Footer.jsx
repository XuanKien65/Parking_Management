import React from "react";
import { Link } from "react-router-dom";
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";
import "./layout.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>Về Chúng Tôi</h3>
          <p>Bãi đỗ xe thông minh PTIT - Giải pháp đỗ xe hiện đại, an toàn và tiện lợi cho cộng đồng.</p>
          <div className="social-links">
            <a href="#"><FaFacebook /></a>
            <a href="#"><FaTwitter /></a>
            <a href="#"><FaInstagram /></a>
          </div>
        </div>

        <div className="footer-section">
          <h3>Liên Hệ</h3>
          <ul>
            <li><FaPhone /> (024) 1234 5678</li>
            <li><FaEnvelope /> info@ptitparking.com</li>
            <li><FaMapMarkerAlt /> Km10, Đường Nguyễn Trãi, Hà Đông, Hà Nội</li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Liên Kết Nhanh</h3>
          <ul>
            <li><Link to="/booking">Đặt chỗ đỗ xe</Link></li>
            <li><Link to="/pricing">Bảng giá</Link></li>
            <li><Link to="/contact">Liên hệ</Link></li>
            <li><Link to="/faq">Câu hỏi thường gặp</Link></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2024 Bãi Đỗ Xe PTIT. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
