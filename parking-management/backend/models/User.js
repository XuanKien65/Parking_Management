const db = require('../config/database');

class User {
  static async create(userData) {
    const { name, email, password, phone, role = 'user' } = userData;
    const query = 'INSERT INTO users (name, email, password, phone, role) VALUES (?, ?, ?, ?, ?)';
    const values = [name, email, password, phone, role];
    
    return new Promise((resolve, reject) => {
      db.query(query, values, (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results.insertId);
        }
      });
    });
  }

  static async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = ?';
    
    return new Promise((resolve, reject) => {
      db.query(query, [email], (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results[0]);
        }
      });
    });
  }

  static async findById(id) {
    const query = 'SELECT * FROM users WHERE id = ?';
    
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

  static async findAll() {
    const query = 'SELECT id, name, email, phone, role, createdAt FROM users';
    
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
}

module.exports = User; 