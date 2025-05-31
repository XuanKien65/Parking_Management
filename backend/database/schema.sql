create database parking_smart;
use parking_smart;

-- Tạo bảng users
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL, 
    phone VARCHAR(20) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    token VARCHAR(255),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tạo bảng areas
CREATE TABLE areas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    areaId VARCHAR(10) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    totalSpaces INT NOT NULL,
    availableSpaces INT NOT NULL,
    pricePerHour DECIMAL(10,2) NOT NULL,
    status ENUM('active', 'maintenance', 'closed') DEFAULT 'active',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tạo bảng bookings
CREATE TABLE bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    areaId VARCHAR(10) NOT NULL,
    startTime DATETIME NOT NULL,
    endTime DATETIME NOT NULL,
    status ENUM('pending', 'confirmed', 'cancelled', 'completed') DEFAULT 'pending',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id),
    FOREIGN KEY (areaId) REFERENCES areas(areaId)
);

-- Tạo bảng payments
CREATE TABLE payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    bookingId INT NOT NULL,
    userId INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    status ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
    paymentMethod VARCHAR(50) NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (bookingId) REFERENCES bookings(id),
    FOREIGN KEY (userId) REFERENCES users(id)
);

-- Thêm dữ liệu mẫu cho areas
INSERT INTO areas (areaId, name, totalSpaces, availableSpaces, pricePerHour) VALUES
('A', 'Khu vực A', 30, 30, 10000),
('B', 'Khu vực B', 30, 30, 15000),
('C', 'Khu vực C', 30, 30, 20000);

-- Thêm tài khoản admin mẫu
INSERT INTO users (name, email, password, phone, role, token) VALUES
('Admin', 'admin@gmail.com', '123456', '0999999999', 'admin', 'admin-token-123');

drop table users;
drop table bookings;
drop table payments;
drop table areas;