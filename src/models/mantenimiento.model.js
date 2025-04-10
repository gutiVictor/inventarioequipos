const pool = require('../config/db.config');

class Mantenimiento {
    static async getAll() {
        try {
            const [rows] = await pool.query(`
                SELECT m.*, a.nombre as articulo_nombre
                FROM mantenimientos m
                LEFT JOIN articulos a ON m.articulo_id = a.id
                ORDER BY m.fecha_inicio DESC
            `);
            return rows;
        } catch (error) {
            throw error;
        }
    }

    static async getById(id) {
        try {
            const [rows] = await pool.query(`
                SELECT m.*, a.nombre as articulo_nombre
                FROM mantenimientos m
                LEFT JOIN articulos a ON m.articulo_id = a.id
                WHERE m.id = ?
            `, [id]);
            return rows[0];
        } catch (error) {
            throw error;
        }
    }

    static async create(mantenimiento) {
        try {
            const [result] = await pool.query(
                'INSERT INTO mantenimientos (articulo_id, fecha_inicio, fecha_fin, costo, descripcion, tecnico, estado) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [mantenimiento.articulo_id, mantenimiento.fecha_inicio, mantenimiento.fecha_fin, mantenimiento.costo, mantenimiento.descripcion, mantenimiento.tecnico, mantenimiento.estado]
            );
            return { id: result.insertId, ...mantenimiento };
        } catch (error) {
            throw error;
        }
    }

    static async update(id, mantenimiento) {
        try {
            const [result] = await pool.query(
                'UPDATE mantenimientos SET articulo_id = ?, fecha_inicio = ?, fecha_fin = ?, costo = ?, descripcion = ?, tecnico = ?, estado = ? WHERE id = ?',
                [mantenimiento.articulo_id, mantenimiento.fecha_inicio, mantenimiento.fecha_fin, mantenimiento.costo, mantenimiento.descripcion, mantenimiento.tecnico, mantenimiento.estado, id]
            );
            return { id, ...mantenimiento };
        } catch (error) {
            throw error;
        }
    }

    static async delete(id) {
        try {
            await pool.query('DELETE FROM mantenimientos WHERE id = ?', [id]);
            return true;
        } catch (error) {
            throw error;
        }
    }

    static async getByArticuloId(articulo_id) {
        try {
            const [rows] = await pool.query(
                'SELECT * FROM mantenimientos WHERE articulo_id = ? ORDER BY fecha_inicio DESC',
                [articulo_id]
            );
            return rows;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Mantenimiento;