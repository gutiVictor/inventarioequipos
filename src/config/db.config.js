const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: 3306,  // Explicitly set MySQL port
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',  // Empty password
  database: process.env.DB_DATABASE || 'gestion_alquiler_maquinaria',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test the connection
pool.getConnection()
  .then(connection => {
    console.log('Database connected successfully');
    connection.release();
  })
  .catch(err => {
    console.error('Error connecting to the database:', err.message);
  });

module.exports = pool;