const pool = require('../config/db.config');

class Sucursal {
  static async getAll() {
    try {
      const [rows] = await pool.query('SELECT * FROM sucursales');
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async create(sucursal) {
    try {
      const [result] = await pool.query(
        'INSERT INTO sucursales (nombre, direccion, telefono, email) VALUES (?, ?, ?, ?)',
        [sucursal.nombre, sucursal.direccion, sucursal.telefono, sucursal.email]
      );
      return result;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Sucursal;