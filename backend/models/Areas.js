const db = require('../config/database');

class Area {
  static async create(areaData) {
    const { areaId, name, totalSpaces, availableSpaces, pricePerHour, status = 'active' } = areaData;
    const query = 'INSERT INTO areas (areaId, name, totalSpaces, availableSpaces, pricePerHour, status) VALUES (?, ?, ?, ?, ?, ?)';
    const values = [areaId, name, totalSpaces, availableSpaces, pricePerHour, status];
    
    return new Promise((resolve, reject) => {
      db.query(query, values, (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve({
            areaId,
            name,
            totalSpaces,
            availableSpaces,
            pricePerHour,
            status
          });
        }
      });
    });
  }

  static async findAll() {
    const query = 'SELECT * FROM areas';
    
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

  static async findById(areaId) {
    const query = 'SELECT * FROM areas WHERE areaId = ?';
    
    return new Promise((resolve, reject) => {
      db.query(query, [areaId], (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results[0]);
        }
      });
    });
  }

  static async update(areaId, updateData) {
    const allowedFields = ['name', 'totalSpaces', 'availableSpaces', 'pricePerHour', 'status'];
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

    values.push(areaId);
    const query = `UPDATE areas SET ${updates.join(', ')} WHERE areaId = ?`;
    
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

  static async updateAvailableSpaces(areaId, availableSpaces) {
    const query = 'UPDATE areas SET availableSpaces = ? WHERE areaId = ?';
    
    return new Promise((resolve, reject) => {
      db.query(query, [availableSpaces, areaId], (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results.affectedRows > 0);
        }
      });
    });
  }
}

module.exports = Area; 