const pool = require('../config/db.config');

class HistoricoEstado {
  static async getAll() {
    try {
      const [rows] = await pool.query(`
        SELECT h.*, a.nombre as articulo_nombre, u.nombre as usuario_nombre
        FROM historico_estados h
        LEFT JOIN articulos a ON h.articulo_id = a.id
        LEFT JOIN usuarios u ON h.usuario_id = u.id
      `);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async getById(id) {
    try {
      const [rows] = await pool.query(`
        SELECT h.*, a.nombre as articulo_nombre, u.nombre as usuario_nombre
        FROM historico_estados h
        LEFT JOIN articulos a ON h.articulo_id = a.id
        LEFT JOIN usuarios u ON h.usuario_id = u.id
        WHERE h.id = ?
      `, [id]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async getByArticuloId(articuloId) {
    try {
      const [rows] = await pool.query(`
        SELECT h.*, a.nombre as articulo_nombre, u.nombre as usuario_nombre
        FROM historico_estados h
        LEFT JOIN articulos a ON h.articulo_id = a.id
        LEFT JOIN usuarios u ON h.usuario_id = u.id
        WHERE h.articulo_id = ?
        ORDER BY h.fecha_cambio DESC
      `, [articuloId]);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async create(historicoEstado) {
    try {
      const [result] = await pool.query(
        'INSERT INTO historico_estados (articulo_id, estado_anterior, estado_nuevo, fecha_cambio, usuario_id, motivo) VALUES (?, ?, ?, CURRENT_TIMESTAMP, ?, ?)',
        [historicoEstado.articulo_id, historicoEstado.estado_anterior, historicoEstado.estado_nuevo, historicoEstado.usuario_id, historicoEstado.motivo]
      );
      return result;
    } catch (error) {
      throw error;
    }
  }

  static async update(id, historicoEstado) {
    try {
      const [result] = await pool.query(
        'UPDATE historico_estados SET articulo_id = ?, estado_anterior = ?, estado_nuevo = ?, usuario_id = ?, motivo = ? WHERE id = ?',
        [historicoEstado.articulo_id, historicoEstado.estado_anterior, historicoEstado.estado_nuevo, historicoEstado.usuario_id, historicoEstado.motivo, id]
      );
      return result;
    } catch (error) {
      throw error;
    }
  }

  static async delete(id) {
    try {
      const [result] = await pool.query('DELETE FROM historico_estados WHERE id = ?', [id]);
      return result;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = HistoricoEstado;