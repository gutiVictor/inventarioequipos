const pool = require('../config/db.config');

class AlquilerDetalle {
    // Métodos básicos CRUD
    static async getAll() {
        const [rows] = await pool.query('SELECT * FROM alquiler_detalles');
        return rows;
    }

    static async getById(id) {
        const [rows] = await pool.query('SELECT * FROM alquiler_detalles WHERE id = ?', [id]);
        return rows[0];
    }

    static async create(alquilerDetalleData) {
        const { alquiler_id, articulo_id, cantidad, precio_unitario, devuelto, fecha_devolucion, multa, observaciones } = alquilerDetalleData;
        const [result] = await pool.query(
            'INSERT INTO alquiler_detalles (alquiler_id, articulo_id, cantidad, precio_unitario, devuelto, fecha_devolucion, multa, observaciones) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [alquiler_id, articulo_id, cantidad, precio_unitario, devuelto || 0, fecha_devolucion || null, multa || 0.00, observaciones || null]
        );
        return { id: result.insertId, ...alquilerDetalleData };
    }

    static async update(id, alquilerDetalleData) {
        const { alquiler_id, articulo_id, cantidad, precio_unitario, devuelto, fecha_devolucion, multa, observaciones } = alquilerDetalleData;
        await pool.query(
            'UPDATE alquiler_detalles SET alquiler_id = ?, articulo_id = ?, cantidad = ?, precio_unitario = ?, devuelto = ?, fecha_devolucion = ?, multa = ?, observaciones = ? WHERE id = ?',
            [alquiler_id, articulo_id, cantidad, precio_unitario, devuelto, fecha_devolucion, multa || 0.00, observaciones || null, id]
        );
        return { id, ...alquilerDetalleData };
    }

    static async delete(id) {
        await pool.query('DELETE FROM alquiler_detalles WHERE id = ?', [id]);
        return true;
    }

    static async getByAlquilerId(alquiler_id) {
        const [rows] = await pool.query(`
            SELECT ad.*, ar.nombre AS articulo_nombre 
            FROM alquiler_detalles ad
            JOIN articulos ar ON ad.articulo_id = ar.id
            WHERE ad.alquiler_id = ?
        `, [alquiler_id]);
        return rows;
    }

    // Métodos específicos para el dashboard
    static async getEquiposAlquiladosActivos() {
        const [rows] = await pool.query(`
            SELECT 
                ad.id,
                ad.cantidad,
                ad.fecha_devolucion,
                ar.nombre AS equipo,
                ar.codigo_barras,
                a.fecha_inicio,
                a.fecha_fin,
                CONCAT(c.nombre, ' ', c.apellido) AS cliente,
                c.telefono AS contacto
            FROM alquiler_detalles ad
            JOIN articulos ar ON ad.articulo_id = ar.id
            JOIN alquileres a ON ad.alquiler_id = a.id
            JOIN clientes c ON a.cliente_id = c.id
            WHERE ad.devuelto = 0 AND a.estado = 'activo'
            ORDER BY a.fecha_fin ASC
        `);
        return rows;
    }

    static async countEquiposAlquilados() {
        const [rows] = await pool.query(`
            SELECT COUNT(*) AS total
            FROM alquiler_detalles ad
            JOIN alquileres a ON ad.alquiler_id = a.id
            WHERE ad.devuelto = 0 AND a.estado = 'activo'
        `);
        return rows[0].total;
    }

    static async getProximasDevoluciones(dias = 3) {
        const [rows] = await pool.query(`
            SELECT 
                ar.nombre AS equipo,
                a.fecha_fin,
                CONCAT(c.nombre, ' ', c.apellido) AS cliente,
                c.telefono,
                DATEDIFF(a.fecha_fin, CURDATE()) AS dias_restantes
            FROM alquiler_detalles ad
            JOIN articulos ar ON ad.articulo_id = ar.id
            JOIN alquileres a ON ad.alquiler_id = a.id
            JOIN clientes c ON a.cliente_id = c.id
            WHERE 
                ad.devuelto = 0 
                AND a.estado = 'activo'
                AND a.fecha_fin BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL ? DAY)
            ORDER BY a.fecha_fin ASC
        `, [dias]);
        return rows;
    }
}

module.exports = AlquilerDetalle;