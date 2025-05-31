import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaCreditCard, FaMoneyBillWave, FaQrcode } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import bookingService from "../services/bookingService";
import paymentService from "../services/paymentService";
import "./payment.css";

const Payment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("credit_card");

  useEffect(() => {
    const loadBooking = async () => {
      try {
        const data = await bookingService.getBookingById(id);
        console.log("Booking data:", data);
        setBooking(data);
      } catch (error) {
        console.error("Error loading booking:", error);
        setError("Không thể tải thông tin đặt chỗ. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadBooking();
    }
  }, [id]);

  const handlePayment = async () => {
    if (!booking || !user) return;

    try {
      setLoading(true);
      const paymentData = {
        bookingId: booking.id,
        userId: user.id,
        amount: calculateAmount(),
        paymentMethod
      };

      console.log("Submitting payment:", paymentData);
      const response = await paymentService.createPayment(paymentData);
      console.log("Payment response:", response);

      if (response && response.payment && response.payment.id) {
        navigate(`/payment-success/${response.payment.id}`);
      } else if (response && response.id) {
        navigate(`/payment-success/${response.id}`);
      } else {
        console.error("Invalid payment response structure:", response);
        throw new Error("Không nhận được ID thanh toán từ server");
      }
    } catch (error) {
      console.error("Payment error:", error);
      console.error("Error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      setError(
        error.response?.data?.message || 
        error.message || 
        "Có lỗi xảy ra khi thanh toán. Vui lòng thử lại sau."
      );
    } finally {
      setLoading(false);
    }
  };

  const calculateAmount = () => {
    if (!booking) return 0;
    const start = new Date(booking.startTime);
    const end = new Date(booking.endTime);
    const hours = (end - start) / (1000 * 60 * 60);
    return Math.ceil(hours) * 10000; // 10,000 VND per hour
  };

  if (loading) {
    return <div className="loading">Đang tải...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!booking) {
    return <div className="error-message">Không tìm thấy thông tin đặt chỗ</div>;
  }

  return (
    <div className="payment-page">
      <div className="payment-container">
        <div className="payment-header">
          <h1>Thanh Toán</h1>
          <p>Vui lòng kiểm tra thông tin và chọn phương thức thanh toán</p>
        </div>

        <div className="booking-details">
          <h2>Thông Tin Đặt Chỗ</h2>
          <div className="detail-item">
            <span>Khu vực:</span>
            <span>{booking.areaName || "Đang cập nhật"}</span>
          </div>
          <div className="detail-item">
            <span>Thời gian bắt đầu:</span>
            <span>{new Date(booking.startTime).toLocaleString()}</span>
          </div>
          <div className="detail-item">
            <span>Thời gian kết thúc:</span>
            <span>{new Date(booking.endTime).toLocaleString()}</span>
          </div>
          <div className="detail-item total">
            <span>Tổng tiền:</span>
            <span>{calculateAmount().toLocaleString()} VND</span>
          </div>
        </div>

        <div className="payment-methods">
          <h2>Phương Thức Thanh Toán</h2>
          <div className="method-options">
            <label className={`method-option ${paymentMethod === 'credit_card' ? 'selected' : ''}`}>
              <input
                type="radio"
                name="paymentMethod"
                value="credit_card"
                checked={paymentMethod === 'credit_card'}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <FaCreditCard />
              <span>Thẻ tín dụng</span>
            </label>

            <label className={`method-option ${paymentMethod === 'cash' ? 'selected' : ''}`}>
              <input
                type="radio"
                name="paymentMethod"
                value="cash"
                checked={paymentMethod === 'cash'}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <FaMoneyBillWave />
              <span>Tiền mặt</span>
            </label>

            <label className={`method-option ${paymentMethod === 'qr_code' ? 'selected' : ''}`}>
              <input
                type="radio"
                name="paymentMethod"
                value="qr_code"
                checked={paymentMethod === 'qr_code'}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <FaQrcode />
              <span>QR Code</span>
            </label>
          </div>
        </div>

        <button
          className="payment-button"
          onClick={handlePayment}
          disabled={loading}
        >
          {loading ? "Đang xử lý..." : "Thanh Toán"}
        </button>
      </div>
    </div>
  );
};

export default Payment;
