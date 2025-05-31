import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaParking, FaCalendarAlt, FaClock, FaCar } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import areaService from "../services/areaService";
import bookingService from "../services/bookingService";
import "./booking.css";

const Booking = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [areas, setAreas] = useState([]);
  const [selectedAreaId, setSelectedAreaId] = useState("");
  const [bookingDate, setBookingDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadAreas = async () => {
      try {
        const data = await areaService.getAvailableAreas();
        console.log("Loaded areas data:", data);
        if (Array.isArray(data)) {
          setAreas(data);
        } else {
          console.error("Areas data is not an array:", data);
          setError("Dữ liệu khu vực không hợp lệ");
        }
      } catch (error) {
        console.error("Error loading areas:", error);
        setError("Không thể tải danh sách khu vực. Vui lòng thử lại sau.");
      }
    };
    loadAreas();
  }, []);

  const validateBooking = () => {
    if (!selectedAreaId) {
      setError("Vui lòng chọn khu vực đỗ xe");
      return false;
    }
    if (!bookingDate) {
      setError("Vui lòng chọn ngày đặt");
      return false;
    }
    if (!startTime) {
      setError("Vui lòng chọn giờ bắt đầu");
      return false;
    }
    if (!endTime) {
      setError("Vui lòng chọn giờ kết thúc");
      return false;
    }

    // Validate time
    const start = new Date(`${bookingDate}T${startTime}`);
    const end = new Date(`${bookingDate}T${endTime}`);
    const now = new Date();

    if (start < now) {
      setError("Thời gian bắt đầu không được trong quá khứ");
      return false;
    }
    if (end <= start) {
      setError("Thời gian kết thúc phải sau thời gian bắt đầu");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!user) {
      navigate("/login");
      return;
    }

    if (!validateBooking()) {
      return;
    }

    setLoading(true);

    try {
      // Validate areaId
      if (!selectedAreaId) {
        throw new Error("Vui lòng chọn khu vực đỗ xe");
      }

      // Log user data
      console.log("Current user:", user);
      console.log("User ID:", user.id);
      console.log("User ID type:", typeof user.id);

      // Log all areas for debugging
      console.log("All available areas:", areas);

      // Log the selected area details
      const selectedArea = areas.find(area => area.areaId === selectedAreaId);
      console.log("Selected area:", selectedArea);
      console.log("Selected areaId:", selectedAreaId);
      console.log("Selected areaId type:", typeof selectedAreaId);

      if (!selectedArea) {
        throw new Error("Không tìm thấy khu vực đã chọn");
      }

      // Log date and time values
      console.log("Booking date:", bookingDate);
      console.log("Start time:", startTime);
      console.log("End time:", endTime);

      // Combine date and time
      const startDateTime = `${bookingDate}T${startTime}:00`;
      const endDateTime = `${bookingDate}T${endTime}:00`;

      console.log("Formatted start time:", startDateTime);
      console.log("Formatted end time:", endDateTime);

      const bookingData = {
        userId: parseInt(user.id),
        areaId: selectedAreaId,
        startTime: startDateTime,
        endTime: endDateTime
      };

      // Validate all required fields before sending
      const requiredFields = ['userId', 'areaId', 'startTime', 'endTime'];
      const missingFields = requiredFields.filter(field => !bookingData[field]);
      
      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
      }

      console.log("Submitting booking data:", bookingData);
      console.log("Booking data types:", {
        userId: typeof bookingData.userId,
        areaId: typeof bookingData.areaId,
        startTime: typeof bookingData.startTime,
        endTime: typeof bookingData.endTime
      });

      const response = await bookingService.createBooking(bookingData);
      console.log("Booking response:", response);

      // Check for booking ID in the response
      if (response && response.booking && response.booking.id) {
        navigate(`/payment/${response.booking.id}`);
      } else if (response && response.id) {
        navigate(`/payment/${response.id}`);
      } else {
        console.error("Invalid response structure:", response);
        throw new Error("Không nhận được ID booking từ server");
      }
    } catch (error) {
      console.error("Booking error:", error);
      console.error("Error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      setError(
        error.response?.data?.message || 
        error.message || 
        "Có lỗi xảy ra khi đặt chỗ. Vui lòng thử lại sau."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="booking-page">
      <div className="booking-container">
        <div className="booking-header">
          <h1>Đặt Chỗ Đỗ Xe</h1>
          <p>Chọn khu vực và thời gian đỗ xe của bạn</p>
        </div>

        <form onSubmit={handleSubmit} className="booking-form">
          <div className="form-group">
          <label>
              <FaParking /> Khu Vực Đỗ Xe
          </label>
            <select
              value={selectedAreaId}
              onChange={(e) => {
                const value = e.target.value;
                console.log("Selected area value:", value);
                console.log("Selected area value type:", typeof value);
                setSelectedAreaId(value);
              }}
              required
            >
              <option value="">Chọn khu vực</option>
              {areas && areas.map((area) => {
                console.log("Rendering area:", area);
                return (
                  <option key={area.areaId} value={area.areaId}>
                    {area.name} - {area.location} (Còn {area.availableSpaces} chỗ)
                  </option>
                );
              })}
            </select>
          </div>

          <div className="form-group">
          <label>
              <FaCalendarAlt /> Ngày Đặt
            </label>
            <input
              type="date"
              value={bookingDate}
              onChange={(e) => setBookingDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
          <label>
                <FaClock /> Giờ Bắt Đầu
              </label>
            <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
            />
            </div>

            <div className="form-group">
          <label>
                <FaClock /> Giờ Kết Thúc
          </label>
            <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
              />
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Đang xử lý..." : "Tiếp tục thanh toán"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Booking;
