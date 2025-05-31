const db = require('../config/database');

class Payment {
  static async create(paymentData) {
    const { bookingId, userId, amount, status = 'pending', paymentMethod } = paymentData;
    const query = 'INSERT INTO payments (bookingId, userId, amount, status, paymentMethod) VALUES (?, ?, ?, ?, ?)';
    const values = [bookingId, userId, amount, status, paymentMethod];
    
    return new Promise((resolve, reject) => {
      db.query(query, values, (error, results) => {
        if (error) {
          reject(error);
        } else {
          // Return the created payment data
          resolve({
            id: results.insertId,
            bookingId,
            userId,
            amount,
            status,
            paymentMethod
          });
        }
      });
    });
  }

  static async findById(id) {
    const query = `
      SELECT p.*, b.startTime, b.endTime, a.name as areaName, u.name as userName 
      FROM payments p
      LEFT JOIN bookings b ON p.bookingId = b.id
      LEFT JOIN areas a ON b.areaId = a.areaId
      LEFT JOIN users u ON p.userId = u.id
      WHERE p.id = ?
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
      SELECT p.*, b.startTime, b.endTime, a.name as areaName, u.name as userName 
      FROM payments p
      LEFT JOIN bookings b ON p.bookingId = b.id
      LEFT JOIN areas a ON b.areaId = a.areaId
      LEFT JOIN users u ON p.userId = u.id
      WHERE p.userId = ? 
      ORDER BY p.createdAt DESC
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

  static async findAll() {
    const query = `
      SELECT p.*, b.startTime, b.endTime, a.name as areaName, u.name as userName 
      FROM payments p
      LEFT JOIN bookings b ON p.bookingId = b.id
      LEFT JOIN areas a ON b.areaId = a.areaId
      LEFT JOIN users u ON p.userId = u.id
      ORDER BY p.createdAt DESC
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
    const allowedFields = ['bookingId', 'userId', 'amount', 'status', 'paymentMethod'];
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
    const query = `UPDATE payments SET ${updates.join(', ')} WHERE id = ?`;
    
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
    const query = 'UPDATE payments SET status = ? WHERE id = ?';
    
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

module.exports = Payment; 