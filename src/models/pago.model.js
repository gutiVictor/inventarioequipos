const pool = require('../config/db.config');

class Pago {
  static async getAll() {
    try {
      const [rows] = await pool.query(`
        SELECT p.*, a.fecha_inicio as alquiler_fecha, c.nombre as cliente_nombre 
        FROM pagos p 
        JOIN alquileres a ON p.alquiler_id = a.id 
        JOIN clientes c ON a.cliente_id = c.id
      `);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async getById(id) {
    try {
      const [rows] = await pool.query(`
        SELECT p.*, a.fecha_inicio as alquiler_fecha, c.nombre as cliente_nombre 
        FROM pagos p 
        JOIN alquileres a ON p.alquiler_id = a.id 
        JOIN clientes c ON a.cliente_id = c.id 
        WHERE p.id = ?
      `, [id]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async create(pago) {
    try {
      const [result] = await pool.query(
        'INSERT INTO pagos (alquiler_id, monto, fecha_pago, metodo_pago, estado, referencia) VALUES (?, ?, ?, ?, ?, ?)',
        [pago.alquiler_id, pago.monto, pago.fecha_pago, pago.metodo_pago, pago.estado, pago.referencia]
      );
      return result;
    } catch (error) {
      throw error;
    }
  }

  static async update(id, pago) {
    try {
      const [result] = await pool.query(
        'UPDATE pagos SET alquiler_id = ?, monto = ?, fecha_pago = ?, metodo_pago = ?, estado = ?, referencia = ? WHERE id = ?',
        [pago.alquiler_id, pago.monto, pago.fecha_pago, pago.metodo_pago, pago.estado, pago.referencia, id]
      );
      return result;
    } catch (error) {
      throw error;
    }
  }

  static async delete(id) {
    try {
      const [result] = await pool.query('DELETE FROM pagos WHERE id = ?', [id]);
      return result;
    } catch (error) {
      throw error;
    }
  }

  static async getByAlquilerId(alquilerId) {
    try {
      const [rows] = await pool.query(
        'SELECT * FROM pagos WHERE alquiler_id = ? ORDER BY fecha_pago DESC',
        [alquilerId]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async getTotalPagadoByAlquiler(alquilerId) {
    try {
      const [rows] = await pool.query(
        'SELECT SUM(monto) as total_pagado FROM pagos WHERE alquiler_id = ? AND estado = "completado"',
        [alquilerId]
      );
      return rows[0].total_pagado || 0;
    } catch (error) {
      throw error;
    }
  }

  static async getPagosPendientes() {
    try {
      const [rows] = await pool.query(
        'SELECT * FROM pagos WHERE estado = "pendiente" ORDER BY fecha_pago ASC'
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Pago;