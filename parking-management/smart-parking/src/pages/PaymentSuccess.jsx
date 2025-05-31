import React from "react";
import { useNavigate } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";
import "./payment.css";

function PaymentSuccess() {
  const navigate = useNavigate();

  return (
    <div className="payment-page">
      <div className="payment-container">
        <div className="success-message">
          <FaCheckCircle className="success-icon" />
          <h2>Thanh toán thành công!</h2>
          <p>Cảm ơn bạn đã sử dụng dịch vụ đặt chỗ bãi đỗ xe thông minh.</p>
          <button className="btn-confirm" onClick={() => navigate("/booking")}>
            Quay lại đặt chỗ mới
          </button>
        </div>
      </div>
    </div>
  );
}

export default PaymentSuccess;
