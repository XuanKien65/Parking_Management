const mysql = require('mysql2');

// MySQL connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'kienbeo123@A1',
  database: 'parking_smart'
});

// Test database connection
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log('Successfully connected to MySQL database!');
});

module.exports = connection;
