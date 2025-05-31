import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import adminService from "../services/adminService";
import "./admin.css";

function AdminDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("users");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [users, setUsers] = useState([]);
  const [areas, setAreas] = useState([]);
  const [payments, setPayments] = useState([]);
  const [bookings, setBookings] = useState([]);

  // Form states for area management
  const [newArea, setNewArea] = useState({ name: '', totalSpaces: '', pricePerHour: '' });
  const [editingArea, setEditingArea] = useState(null);

  useEffect(() => {
    if (user && user.role === 'admin') {
      loadData();
    } else {
      setError("Bạn không có quyền truy cập trang này");
    }
  }, [activeTab, user]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      console.log("Loading data for tab:", activeTab);
      console.log("Current user:", user);

      let data;
      switch (activeTab) {
        case "users":
          data = await adminService.getAllUsers();
          console.log("Users data:", data);
          setUsers(Array.isArray(data) ? data : []);
          break;
        case "areas":
          data = await adminService.getAllAreas();
          console.log("Areas data:", data);
          setAreas(Array.isArray(data) ? data : []);
          break;
        case "payments":
          data = await adminService.getAllPayments();
          console.log("Payments data:", data);
          setPayments(Array.isArray(data) ? data : []);
          break;
        case "bookings":
          data = await adminService.getAllBookings();
          console.log("Bookings data:", data);
          setBookings(Array.isArray(data) ? data : []);
          break;
      }
    } catch (error) {
      console.error("Error loading data:", error);
      console.error("Error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      setError(
        error.response?.data?.message || 
        error.message || 
        "Có lỗi xảy ra khi tải dữ liệu"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCreateArea = async (e) => {
    e.preventDefault();
    try {
      await adminService.createArea(newArea);
      setNewArea({ name: '', totalSpaces: '', pricePerHour: '' });
      loadData();
    } catch (error) {
      setError(error.message || "Có lỗi xảy ra khi tạo khu vực mới");
    }
  };

  const handleUpdateArea = async (e) => {
    e.preventDefault();
    try {
      await adminService.updateArea(editingArea.areaId, editingArea);
      setEditingArea(null);
      loadData();
    } catch (error) {
      setError(error.message || "Có lỗi xảy ra khi cập nhật khu vực");
    }
  };

  const handleDeleteArea = async (areaId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa khu vực này?')) {
      try {
        await adminService.deleteArea(areaId);
        loadData();
      } catch (error) {
        setError(error.message || "Có lỗi xảy ra khi xóa khu vực");
      }
    }
  };

  const handleUpdateBookingStatus = async (bookingId, status) => {
    try {
      await adminService.updateBookingStatus(bookingId, status);
      loadData();
    } catch (error) {
      setError(error.message || "Có lỗi xảy ra khi cập nhật trạng thái đặt chỗ");
    }
  };

  const handleDeleteBooking = async (bookingId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa đặt chỗ này?')) {
      try {
        await adminService.deleteBooking(bookingId);
        loadData();
      } catch (error) {
        setError(error.message || "Có lỗi xảy ra khi xóa đặt chỗ");
      }
    }
  };

  if (loading) {
    return <div className="loading">Đang tải...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="admin-dashboard">
      <h2>Trang Quản trị</h2>

      <div className="admin-tab-buttons">
        <button
          className={activeTab === "users" ? "active" : ""}
          onClick={() => setActiveTab("users")}
        >
          Người dùng
        </button>
        <button
          className={activeTab === "areas" ? "active" : ""}
          onClick={() => setActiveTab("areas")}
        >
          Bãi đỗ xe
        </button>
        <button
          className={activeTab === "payments" ? "active" : ""}
          onClick={() => setActiveTab("payments")}
        >
          Thanh toán
        </button>
        <button
          className={activeTab === "bookings" ? "active" : ""}
          onClick={() => setActiveTab("bookings")}
        >
          Đặt chỗ
        </button>
      </div>

      <div className="admin-tab-content">
        {activeTab === "users" && (
          <div>
            <h3>Danh sách người dùng</h3>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Tên</th>
                  <th>SĐT</th>
                  <th>Vai trò</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.phone}</td>
                    <td>{user.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "areas" && (
          <div>
            <h3>Quản lý bãi đỗ xe</h3>
            
            <form onSubmit={handleCreateArea} className="area-form">
              <h4>Thêm khu vực mới</h4>
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Tên khu vực"
                  value={newArea.name}
                  onChange={(e) => setNewArea({...newArea, name: e.target.value})}
                  required
                />
                <input
                  type="number"
                  placeholder="Số chỗ đỗ"
                  value={newArea.totalSpaces}
                  onChange={(e) => setNewArea({...newArea, totalSpaces: e.target.value})}
                  required
                />
                <input
                  type="number"
                  placeholder="Giá theo giờ (VND)"
                  value={newArea.pricePerHour}
                  onChange={(e) => setNewArea({...newArea, pricePerHour: e.target.value})}
                  required
                />
                <button type="submit">Thêm mới</button>
              </div>
            </form>

            <table className="admin-table">
              <thead>
                <tr>
                  <th>Tên khu vực</th>
                  <th>Số chỗ đỗ</th>
                  <th>Giá theo giờ</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {areas.map((area) => (
                  <tr key={area.areaId}>
                    <td>
                      {editingArea?.areaId === area.areaId ? (
                        <input
                          type="text"
                          value={editingArea.name}
                          onChange={(e) => setEditingArea({...editingArea, name: e.target.value})}
                        />
                      ) : (
                        area.name
                      )}
                    </td>
                    <td>
                      {editingArea?.areaId === area.areaId ? (
                        <input
                          type="number"
                          value={editingArea.totalSpaces}
                          onChange={(e) => setEditingArea({...editingArea, totalSpaces: e.target.value})}
                        />
                      ) : (
                        area.totalSpaces
                      )}
                    </td>
                    <td>
                      {editingArea?.areaId === area.areaId ? (
                        <input
                          type="number"
                          value={editingArea.pricePerHour}
                          onChange={(e) => setEditingArea({...editingArea, pricePerHour: e.target.value})}
                        />
                      ) : (
                        `${area.pricePerHour.toLocaleString()} VND`
                      )}
                    </td>
                    <td>
                      {editingArea?.areaId === area.areaId ? (
                        <>
                          <button onClick={handleUpdateArea}>Lưu</button>
                          <button onClick={() => setEditingArea(null)}>Hủy</button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => setEditingArea(area)}>Sửa</button>
                          <button onClick={() => handleDeleteArea(area.areaId)}>Xóa</button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "payments" && (
          <div>
            <h3>Danh sách thanh toán</h3>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Mã đặt chỗ</th>
                  <th>Tên khách</th>
                  <th>Thời gian</th>
                  <th>Số tiền</th>
                  <th>Phương thức</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr key={payment.id}>
                    <td>{payment.bookingId}</td>
                    <td>{payment.userName}</td>
                    <td>{new Date(payment.bookingTime).toLocaleString()}</td>
                    <td>{payment.amount.toLocaleString()} VND</td>
                    <td>{payment.paymentMethod}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "bookings" && (
          <div>
            <h3>Danh sách đặt chỗ</h3>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Tên khách</th>
                  <th>Khu vực</th>
                  <th>Thời gian bắt đầu</th>
                  <th>Thời gian kết thúc</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking.id}>
                    <td>{booking.userName}</td>
                    <td>{booking.areaName}</td>
                    <td>{new Date(booking.startTime).toLocaleString()}</td>
                    <td>{new Date(booking.endTime).toLocaleString()}</td>
                    <td>
                      <select
                        value={booking.status}
                        onChange={(e) => handleUpdateBookingStatus(booking.id, e.target.value)}
                        className="status-select"
                      >
                        <option value="pending">Chờ duyệt</option>
                        <option value="active">Đang hoạt động</option>
                        <option value="completed">Đã hoàn thành</option>
                        <option value="cancelled">Đã hủy</option>
                      </select>
                    </td>
                    <td>
                      <button onClick={() => handleDeleteBooking(booking.id)}>Xóa</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
