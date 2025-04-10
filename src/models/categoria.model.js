const pool = require('../config/db.config');

class Categoria {
  static async getAll() {
    try {
      const [rows] = await pool.query('SELECT * FROM categorias');
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async getById(id) {
    try {
      const [rows] = await pool.query('SELECT * FROM categorias WHERE id = ?', [id]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async create(categoria) {
    try {
      const [result] = await pool.query(
        'INSERT INTO categorias (nombre, descripcion) VALUES (?, ?)',
        [categoria.nombre, categoria.descripcion]
      );
      return result;
    } catch (error) {
      throw error;
    }
  }

  static async update(id, categoria) {
    try {
      const [result] = await pool.query(
        'UPDATE categorias SET nombre = ?, descripcion = ? WHERE id = ?',
        [categoria.nombre, categoria.descripcion, id]
      );
      return result;
    } catch (error) {
      throw error;
    }
  }

  static async delete(id) {
    try {
      const [result] = await pool.query('DELETE FROM categorias WHERE id = ?', [id]);
      return result;
    } catch (error) {
      throw error;
    }
  }

  static async getArticulos(id) {
    try {
      const [rows] = await pool.query(
        'SELECT * FROM articulos WHERE categoria_id = ?',
        [id]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Categoria;