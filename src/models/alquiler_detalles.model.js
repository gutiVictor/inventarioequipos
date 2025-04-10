const pool = require('../config/db.config');

class AlquilerDetalle {
    static async getAll() {
        try {
            const [rows] = await pool.query(`
                SELECT ad.*, a.nombre as articulo_nombre, al.fecha_inicio as alquiler_fecha
                FROM alquiler_detalles ad
                LEFT JOIN articulos a ON ad.articulo_id = a.id
                LEFT JOIN alquileres al ON ad.alquiler_id = al.id
                ORDER BY ad.alquiler_id DESC
            `);
            return rows;
        } catch (error) {
            throw error;
        }
    }

    static async getById(id) {
        try {
            const [rows] = await pool.query(`
                SELECT ad.*, a.nombre as articulo_nombre, al.fecha_inicio as alquiler_fecha
                FROM alquiler_detalles ad
                LEFT JOIN articulos a ON ad.articulo_id = a.id
                LEFT JOIN alquileres al ON ad.alquiler_id = al.id
                WHERE ad.id = ?
            `, [id]);
            return rows[0];
        } catch (error) {
            throw error;
        }
    }

    static async create(alquilerDetalleData) {
        const { alquiler_id, articulo_id, cantidad, precio_unitario, devuelto, fecha_devolucion, multa, observaciones } = alquilerDetalleData;
        try {
            const [result] = await pool.query(
                'INSERT INTO alquiler_detalles (alquiler_id, articulo_id, cantidad, precio_unitario, devuelto, fecha_devolucion, multa, observaciones) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                [alquiler_id, articulo_id, cantidad, precio_unitario, devuelto || 0, fecha_devolucion, multa, observaciones]
            );
            return { id: result.insertId, ...alquilerDetalleData };
        } catch (error) {
            throw error;
        }
    }

    static async update(id, alquilerDetalleData) {
        const { alquiler_id, articulo_id, cantidad, precio_unitario, devuelto, fecha_devolucion, multa, observaciones } = alquilerDetalleData;
        try {
            await pool.query(
                'UPDATE alquiler_detalles SET alquiler_id = ?, articulo_id = ?, cantidad = ?, precio_unitario = ?, devuelto = ?, fecha_devolucion = ?, multa = ?, observaciones = ? WHERE id = ?',
                [alquiler_id, articulo_id, cantidad, precio_unitario, devuelto, fecha_devolucion, multa, observaciones, id]
            );
            return { id, ...alquilerDetalleData };
        } catch (error) {
            throw error;
        }
    }

    static async delete(id) {
        try {
            await pool.query('DELETE FROM alquiler_detalles WHERE id = ?', [id]);
            return true;
        } catch (error) {
            throw error;
        }
    }

    static async getByAlquilerId(alquiler_id) {
        try {
            const [rows] = await pool.query(`
                SELECT ad.*, a.nombre as articulo_nombre, al.fecha_inicio as alquiler_fecha
                FROM alquiler_detalles ad
                LEFT JOIN articulos a ON ad.articulo_id = a.id
                LEFT JOIN alquileres al ON ad.alquiler_id = al.id
                WHERE ad.alquiler_id = ?
            `, [alquiler_id]);
            return rows;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = AlquilerDetalle;