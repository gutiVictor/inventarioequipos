const pool = require('../config/db.config');

class Equipo {
  static async getAll() {
    try {
      const [rows] = await pool.query('SELECT * FROM equipos');
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async getById(id) {
    try {
      const [rows] = await pool.query('SELECT * FROM equipos WHERE id = ?', [id]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async create(equipo) {
    try {
      const [result] = await pool.query(
        'INSERT INTO equipos (nombre, modelo, marca, estado, sucursal_id) VALUES (?, ?, ?, ?, ?)',
        [equipo.nombre, equipo.modelo, equipo.marca, equipo.estado, equipo.sucursal_id]
      );
      return result;
    } catch (error) {
      throw error;
    }
  }

  static async update(id, equipo) {
    try {
      const [result] = await pool.query(
        'UPDATE equipos SET nombre = ?, modelo = ?, marca = ?, estado = ?, sucursal_id = ? WHERE id = ?',
        [equipo.nombre, equipo.modelo, equipo.marca, equipo.estado, equipo.sucursal_id, id]
      );
      return result;
    } catch (error) {
      throw error;
    }
  }

  static async delete(id) {
    try {
      const [result] = await pool.query('DELETE FROM equipos WHERE id = ?', [id]);
      return result;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Equipo;