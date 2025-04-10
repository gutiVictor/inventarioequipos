const pool = require('../config/db.config');
const bcrypt = require('bcryptjs');

class Usuario {
  static async getAll() {
    try {
      const [rows] = await pool.query('SELECT id, nombre, email, rol FROM usuarios');
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async getById(id) {
    try {
      const [rows] = await pool.query('SELECT id, nombre, email, rol FROM usuarios WHERE id = ?', [id]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async create(usuario) {
    try {
      const hashedPassword = await bcrypt.hash(usuario.password_hash, 10);
      const [result] = await pool.query(
        'INSERT INTO usuarios (nombre, password_hash, email, rol, sucursal_id) VALUES (?, ?, ?, ?, ?)',
        [usuario.nombre, hashedPassword, usuario.email, usuario.rol, usuario.sucursal_id]
      );
      return result;
    } catch (error) {
      throw error;
    }
  }

  static async update(id, usuario) {
    try {
      let query = 'UPDATE usuarios SET nombre = ?, email = ?, rol = ?, sucursal_id = ?';
      let params = [usuario.nombre, usuario.email, usuario.rol, usuario.sucursal_id];

      if (usuario.password_hash) {
        const hashedPassword = await bcrypt.hash(usuario.password_hash, 10);
        query += ', password_hash = ?';
        params.push(hashedPassword);
      }

      query += ' WHERE id = ?';
      params.push(id);

      const [result] = await pool.query(query, params);
      return result;
    } catch (error) {
      throw error;
    }
  }

  static async delete(id) {
    try {
      const [result] = await pool.query('DELETE FROM usuarios WHERE id = ?', [id]);
      return result;
    } catch (error) {
      throw error;
    }
  }

  static async findByUsername(nombre) {
    try {
      const [rows] = await pool.query('SELECT * FROM usuarios WHERE nombre = ?', [nombre]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async validatePassword(password, hashedPassword) {
    return bcrypt.compare(password, hashedPassword);
  }
}

module.exports = Usuario;