const pool = require('../config/db.config');

class Cliente {
  static async getAll() {
    try {
      const [rows] = await pool.query('SELECT * FROM clientes');
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async getById(id) {
    try {
      const [rows] = await pool.query('SELECT * FROM clientes WHERE id = ?', [id]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async create(cliente) {
    console.log("Datos recibidos en modelo:", cliente); // ← Usa el parámetro "cliente", no "req"
    try {
      const [result] = await pool.query(
        'INSERT INTO clientes (nombre, apellido, cedula, telefono, email, direccion) VALUES (?, ?, ?, ?, ?, ?)',
        [cliente.nombre, cliente.apellido, cliente.cedula, cliente.telefono, cliente.email, cliente.direccion]
      );
      return result;
    } catch (error) {
      throw error;
    }
  }

  static async update(id, cliente) {
    try {
      const [result] = await pool.query(
        'UPDATE clientes SET nombre = ?, apellido = ?, cedula = ?, telefono = ?, email = ?, direccion = ? WHERE id = ?',
        [cliente.nombre, cliente.apellido, cliente.cedula, cliente.telefono, cliente.email, cliente.direccion, id]
      );
      return result;
    } catch (error) {
      throw error;
    }
  }

  static async delete(id) {
    try {
      const [result] = await pool.query('DELETE FROM clientes WHERE id = ?', [id]);
      return result;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Cliente;