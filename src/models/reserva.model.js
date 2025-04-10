const pool = require('../config/db.config');

class Reserva {
  static async getAll() {
    try {
      const [rows] = await pool.query(`
        SELECT r.*, c.nombre as cliente_nombre, e.nombre as equipo_nombre 
        FROM reservas r 
        JOIN clientes c ON r.cliente_id = c.id 
        JOIN articulos e ON r.articulo_id = e.id
      `);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async getById(id) {
    try {
      const [rows] = await pool.query(`
        SELECT r.*, c.nombre as cliente_nombre, e.nombre as equipo_nombre 
        FROM reservas r 
        JOIN clientes c ON r.cliente_id = c.id 
        JOIN articulos e ON r.articulo_id = e.id 
        WHERE r.id = ?
      `, [id]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async create(reserva) {
    try {
      const [result] = await pool.query(
        'INSERT INTO reservas (cliente_id, articulo_id, fecha_reserva, fecha_inicio, fecha_fin, estado, notas) VALUES (?, ?, CURRENT_TIMESTAMP, ?, ?, ?, ?)',
        [reserva.cliente_id, reserva.articulo_id, reserva.fecha_inicio, reserva.fecha_fin, reserva.estado || 'pendiente', reserva.notas]
      );
      return result;
    } catch (error) {
      throw error;
    }
  }

  static async update(id, reserva) {
    try {
      const [result] = await pool.query(
        'UPDATE reservas SET cliente_id = ?, articulo_id = ?, fecha_inicio = ?, fecha_fin = ?, estado = ?, notas = ? WHERE id = ?',
        [reserva.cliente_id, reserva.articulo_id, reserva.fecha_inicio, reserva.fecha_fin, reserva.estado, reserva.notas, id]
      );
      return result;
    } catch (error) {
      throw error;
    }
  }

  static async delete(id) {
    try {
      const [result] = await pool.query('DELETE FROM reservas WHERE id = ?', [id]);
      return result;
    } catch (error) {
      throw error;
    }
  }

  static async getByClienteId(clienteId) {
    try {
      const [rows] = await pool.query(`
        SELECT r.*, e.nombre as equipo_nombre 
        FROM reservas r 
        JOIN articulos e ON r.articulo_id = e.id 
        WHERE r.cliente_id = ? 
        ORDER BY r.fecha_inicio DESC
      `, [clienteId]);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async getByEquipoId(equipoId) {
    try {
      const [rows] = await pool.query(`
        SELECT r.*, c.nombre as cliente_nombre 
        FROM reservas r 
        JOIN clientes c ON r.cliente_id = c.id 
        WHERE r.articulo_id = ? 
        ORDER BY r.fecha_inicio DESC
      `, [equipoId]);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async getReservasActivas() {
    try {
      const [rows] = await pool.query(`
        SELECT r.*, c.nombre as cliente_nombre, e.nombre as equipo_nombre 
        FROM reservas r 
        JOIN clientes c ON r.cliente_id = c.id 
        JOIN articulos e ON r.articulo_id = e.id 
        WHERE r.estado = 'confirmada' 
        AND r.fecha_fin >= CURDATE() 
        ORDER BY r.fecha_inicio ASC
      `);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async verificarDisponibilidad(equipoId, fechaInicio, fechaFin) {
    try {
      const [rows] = await pool.query(`
        SELECT COUNT(*) as conflictos 
        FROM reservas 
        WHERE articulo_id = ? 
        AND estado = 'confirmada' 
        AND (
          (fecha_inicio <= ? AND fecha_fin >= ?) OR
          (fecha_inicio <= ? AND fecha_fin >= ?) OR
          (fecha_inicio >= ? AND fecha_fin <= ?)
        )
      `, [equipoId, fechaInicio, fechaInicio, fechaFin, fechaFin, fechaInicio, fechaFin]);
      return rows[0].conflictos === 0;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Reserva;