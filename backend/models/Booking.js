const db = require('../config/database');

class Booking {
  static async create(bookingData) {
    const { userId, areaId, startTime, endTime, status = 'pending' } = bookingData;
    const query = 'INSERT INTO bookings (userId, areaId, startTime, endTime, status) VALUES (?, ?, ?, ?, ?)';
    const values = [userId, areaId, startTime, endTime, status];
    
    return new Promise((resolve, reject) => {
      db.query(query, values, (error, results) => {
        if (error) {
          reject(error);
        } else {
          // Return the created booking data
          resolve({
            id: results.insertId,
            userId,
            areaId,
            startTime,
            endTime,
            status
          });
        }
      });
    });
  }

  static async findById(id) {
    const query = `
      SELECT b.*, a.name as areaName, a.pricePerHour, u.name as userName 
      FROM bookings b
      LEFT JOIN areas a ON b.areaId = a.areaId
      LEFT JOIN users u ON b.userId = u.id
      WHERE b.id = ?
    `;
    
    return new Promise((resolve, reject) => {
      db.query(query, [id], (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results[0]);
        }
      });
    });
  }

  static async findByUserId(userId) {
    const query = `
      SELECT b.*, a.name as areaName, a.pricePerHour, u.name as userName 
      FROM bookings b
      LEFT JOIN areas a ON b.areaId = a.areaId
      LEFT JOIN users u ON b.userId = u.id
      WHERE b.userId = ? 
      ORDER BY b.createdAt DESC
    `;
    
    return new Promise((resolve, reject) => {
      db.query(query, [userId], (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  }

  static async findByAreaId(areaId) {
    const query = `
      SELECT b.*, a.name as areaName, a.pricePerHour, u.name as userName 
      FROM bookings b
      LEFT JOIN areas a ON b.areaId = a.areaId
      LEFT JOIN users u ON b.userId = u.id
      WHERE b.areaId = ? 
      ORDER BY b.createdAt DESC
    `;
    
    return new Promise((resolve, reject) => {
      db.query(query, [areaId], (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  }

  static async findAll() {
    const query = `
      SELECT b.*, a.name as areaName, a.pricePerHour, u.name as userName 
      FROM bookings b
      LEFT JOIN areas a ON b.areaId = a.areaId
      LEFT JOIN users u ON b.userId = u.id
      ORDER BY b.createdAt DESC
    `;
    
    return new Promise((resolve, reject) => {
      db.query(query, (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  }

  static async update(id, updateData) {
    const allowedFields = ['userId', 'areaId', 'startTime', 'endTime', 'status'];
    const updates = [];
    const values = [];

    for (const [key, value] of Object.entries(updateData)) {
      if (allowedFields.includes(key)) {
        updates.push(`${key} = ?`);
        values.push(value);
      }
    }

    if (updates.length === 0) {
      return Promise.resolve(false);
    }

    values.push(id);
    const query = `UPDATE bookings SET ${updates.join(', ')} WHERE id = ?`;
    
    return new Promise((resolve, reject) => {
      db.query(query, values, (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results.affectedRows > 0);
        }
      });
    });
  }

  static async updateStatus(id, status) {
    const query = 'UPDATE bookings SET status = ? WHERE id = ?';
    
    return new Promise((resolve, reject) => {
      db.query(query, [status, id], (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results.affectedRows > 0);
        }
      });
    });
  }
}

module.exports = Booking; 