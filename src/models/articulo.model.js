const pool = require('../config/db.config');

class Articulo {
  static async getAll() {
    try {
      const [rows] = await pool.query(`
        SELECT a.*, c.nombre as categoria_nombre 
        FROM articulos a 
        LEFT JOIN categorias c ON a.categoria_id = c.id
      `);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async getById(id) {
    try {
      const [rows] = await pool.query(`
        SELECT a.*, c.nombre as categoria_nombre 
        FROM articulos a 
        LEFT JOIN categorias c ON a.categoria_id = c.id 
        WHERE a.id = ?
      `, [id]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async create(articulo) {
    try {
      const [result] = await pool.query(
        'INSERT INTO articulos (nombre, codigo_barras, categoria_id, sucursal_id, estado, costo_alquiler_dia, fecha_adquisicion, imagen_url, notas) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [articulo.nombre, articulo.codigo_barras, articulo.categoria_id, articulo.sucursal_id, articulo.estado, articulo.costo_alquiler_dia, articulo.fecha_adquisicion, articulo.imagen_url, articulo.notas]
      );
      return result;
    } catch (error) {
      throw error;
    }
  }

  static async update(id, articulo) {
    try {
      const [result] = await pool.query(
        'UPDATE articulos SET nombre = ?, codigo_barras = ?, categoria_id = ?, sucursal_id = ?, estado = ?, costo_alquiler_dia = ?, fecha_adquisicion = ?, imagen_url = ?, notas = ? WHERE id = ?',
        [articulo.nombre, articulo.codigo_barras, articulo.categoria_id, articulo.sucursal_id, articulo.estado, articulo.costo_alquiler_dia, articulo.fecha_adquisicion, articulo.imagen_url, articulo.notas, id]
      );
      return result;
    } catch (error) {
      throw error;
    }
  }

  static async delete(id) {
    try {
      // Instead of deleting, update the article status to inactive
      const [result] = await pool.query('UPDATE articulos SET estado = "inactivo" WHERE id = ?', [id]);
      if (result.affectedRows === 0) {
        throw new Error('No se pudo desactivar el artículo');
      }
      return result;
    } catch (error) {
      throw error;
    }
  }

  static async getByCategoriaId(categoriaId) {
    try {
      const [rows] = await pool.query(
        'SELECT * FROM articulos WHERE categoria_id = ?',
        [categoriaId]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async updateStock(id, cantidad) {
    try {
      const [result] = await pool.query(
        'UPDATE articulos SET stock = stock + ? WHERE id = ?',
        [cantidad, id]
      );
      return result;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Articulo;