const pool = require('../config/db.config');

class Alquiler {
  static async getAll() {
    try {
      const [rows] = await pool.query(`
        SELECT a.*, c.nombre as cliente_nombre, u.nombre as usuario_nombre
        FROM alquileres a
        LEFT JOIN clientes c ON a.cliente_id = c.id
        LEFT JOIN usuarios u ON a.usuario_id = u.id
        ORDER BY a.fecha_registro DESC
      `);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async getById(id) {
    try {
      const [rows] = await pool.query(`
        SELECT a.*, c.nombre as cliente_nombre, u.nombre as usuario_nombre
        FROM alquileres a
        LEFT JOIN clientes c ON a.cliente_id = c.id
        LEFT JOIN usuarios u ON a.usuario_id = u.id
        WHERE a.id = ?
      `, [id]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async create(alquiler) {
    try {
      const [result] = await pool.query(
        'INSERT INTO alquileres (cliente_id, usuario_id, fecha_inicio, fecha_fin, estado, total, deposito, notas) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [alquiler.cliente_id, alquiler.usuario_id, alquiler.fecha_inicio, alquiler.fecha_fin, alquiler.estado, alquiler.total, alquiler.deposito, alquiler.notas]
      );
      return result;
    } catch (error) {
      throw error;
    }
  }

  static async update(id, alquiler) {
    try {
      const [result] = await pool.query(
        'UPDATE alquileres SET cliente_id = ?, usuario_id = ?, fecha_inicio = ?, fecha_fin = ?, estado = ?, total = ?, deposito = ?, notas = ? WHERE id = ?',
        [alquiler.cliente_id, alquiler.usuario_id, alquiler.fecha_inicio, alquiler.fecha_fin, alquiler.estado, alquiler.total, alquiler.deposito, alquiler.notas, id]
      );
      return result;
    } catch (error) {
      throw error;
    }
  }

  static async delete(id) {
    try {
      const [result] = await pool.query('DELETE FROM alquileres WHERE id = ?', [id]);
      return result;
    } catch (error) {
      throw error;
    }
  }

  static async getByClienteId(clienteId) {
    try {
      const [rows] = await pool.query(`
        SELECT a.*, c.nombre as cliente_nombre, u.nombre as usuario_nombre
        FROM alquileres a
        LEFT JOIN clientes c ON a.cliente_id = c.id
        LEFT JOIN usuarios u ON a.usuario_id = u.id
        WHERE a.cliente_id = ?
        ORDER BY a.fecha_registro DESC
      `, [clienteId]);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async getByUsuarioId(usuarioId) {
    try {
      const [rows] = await pool.query(`
        SELECT a.*, c.nombre as cliente_nombre, u.nombre as usuario_nombre
        FROM alquileres a
        LEFT JOIN clientes c ON a.cliente_id = c.id
        LEFT JOIN usuarios u ON a.usuario_id = u.id
        WHERE a.usuario_id = ?
        ORDER BY a.fecha_registro DESC
      `, [usuarioId]);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async getByEstado(estado) {
    try {
      const [rows] = await pool.query(`
        SELECT a.*, c.nombre as cliente_nombre, u.nombre as usuario_nombre
        FROM alquileres a
        LEFT JOIN clientes c ON a.cliente_id = c.id
        LEFT JOIN usuarios u ON a.usuario_id = u.id
        WHERE a.estado = ?
        ORDER BY a.fecha_registro DESC
      `, [estado]);
      return rows;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Alquiler;