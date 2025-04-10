const Usuario = require('../models/usuario.model');

exports.getAllUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.getAll();
    res.json(usuarios);
  } catch (error) {
    console.error('Database Error:', error);
    res.status(500).json({ 
      message: 'Database connection error',
      error: error.message,
      code: error.code
    });
  }
};

exports.getById = async (req, res) => {
  try {
    const usuario = await Usuario.getById(req.params.id);
    if (usuario) {
      res.json(usuario);
    } else {
      res.status(404).json({ message: 'Usuario no encontrado' });
    }
  } catch (error) {
    console.error('Database Error:', error);
    res.status(500).json({ 
      message: 'Database connection error',
      error: error.message,
      code: error.code
    });
  }
};

exports.create = async (req, res) => {
  try {
    const { nombre, password_hash, email, rol, sucursal_id } = req.body;
    
    // Validate required fields
    const requiredFields = { nombre, password_hash, email, rol };
    const missingFields = Object.entries(requiredFields)
      .filter(([_, value]) => !value)
      .map(([key]) => key);

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: 'Todos los campos son requeridos',
        missingFields: missingFields
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Formato de email inválido' });
    }

    // Validate role
    const validRoles = ['admin', 'user'];
    if (!validRoles.includes(rol)) {
      return res.status(400).json({ message: 'Rol inválido. Debe ser "admin" o "user"' });
    }

    const existingUser = await Usuario.findByUsername(nombre);
    if (existingUser) {
      return res.status(400).json({ message: 'El nombre de usuario ya existe' });
    }

    const result = await Usuario.create({ nombre, password_hash, email, rol, sucursal_id });
    res.status(201).json({
      message: 'Usuario creado exitosamente',
      id: result.insertId
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({
      message: 'Error al crear el usuario',
      error: error.message
    });
  }
};

exports.update = async (req, res) => {
  try {
    const { nombre, password_hash, email, rol, sucursal_id } = req.body;
    if (!nombre || !email || !rol) {
      return res.status(400).json({ message: 'Los campos nombre, email y rol son requeridos' });
    }

    const usuario = await Usuario.getById(req.params.id);
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const result = await Usuario.update(req.params.id, { nombre, password_hash, email, rol, sucursal_id });
    if (result.affectedRows > 0) {
      res.json({ message: 'Usuario actualizado exitosamente' });
    } else {
      res.status(404).json({ message: 'Usuario no encontrado' });
    }
  } catch (error) {
    console.error('Database Error:', error);
    res.status(500).json({ 
      message: 'Database connection error',
      error: error.message,
      code: error.code
    });
  }
};

exports.delete = async (req, res) => {
  try {
    const result = await Usuario.delete(req.params.id);
    if (result.affectedRows > 0) {
      res.json({ message: 'Usuario eliminado exitosamente' });
    } else {
      res.status(404).json({ message: 'Usuario no encontrado' });
    }
  } catch (error) {
    console.error('Database Error:', error);
    res.status(500).json({ 
      message: 'Database connection error',
      error: error.message,
      code: error.code
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { nombre, password_hash } = req.body;
    if (!nombre || !password_hash) {
      return res.status(400).json({ message: 'Nombre y contraseña son requeridos' });
    }

    const usuario = await Usuario.findByUsername(nombre);
    if (!usuario) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const isValidPassword = await Usuario.validatePassword(password_hash, usuario.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    res.json({
      message: 'Login exitoso',
      user: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol
      }
    });
  } catch (error) {
    console.error('Database Error:', error);
    res.status(500).json({ 
      message: 'Database connection error',
      error: error.message,
      code: error.code
    });
  }
};