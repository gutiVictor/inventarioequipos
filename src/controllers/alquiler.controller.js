const Alquiler = require('../models/alquiler.model');

exports.getAllAlquileres = async (req, res) => {
  try {
    const alquileres = await Alquiler.getAll();
    res.json(alquileres);
  } catch (error) {
    console.error('Database Error:', error);
    res.status(500).json({ 
      message: 'Database connection error',
      error: error.message,
      code: error.code
    });
  }
};

exports.getAlquilerById = async (req, res) => {
  try {
    const alquiler = await Alquiler.getById(req.params.id);
    if (!alquiler) {
      return res.status(404).json({ message: 'Alquiler not found' });
    }
    res.json(alquiler);
  } catch (error) {
    console.error('Database Error:', error);
    res.status(500).json({ 
      message: 'Database connection error',
      error: error.message,
      code: error.code
    });
  }
};

exports.createAlquiler = async (req, res) => {
  try {
    const result = await Alquiler.create(req.body);
    res.status(201).json({
      message: 'Alquiler created successfully',
      id: result.insertId
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

exports.updateAlquiler = async (req, res) => {
  try {
    const result = await Alquiler.update(req.params.id, req.body);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Alquiler not found' });
    }
    res.json({ message: 'Alquiler updated successfully' });
  } catch (error) {
    console.error('Database Error:', error);
    res.status(500).json({ 
      message: 'Database connection error',
      error: error.message,
      code: error.code
    });
  }
};

exports.deleteAlquiler = async (req, res) => {
  try {
    const result = await Alquiler.delete(req.params.id);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Alquiler not found' });
    }
    res.json({ message: 'Alquiler deleted successfully' });
  } catch (error) {
    console.error('Database Error:', error);
    res.status(500).json({ 
      message: 'Database connection error',
      error: error.message,
      code: error.code
    });
  }
};

exports.getAlquileresByCliente = async (req, res) => {
  try {
    const alquileres = await Alquiler.getByClienteId(req.params.clienteId);
    res.json(alquileres);
  } catch (error) {
    console.error('Database Error:', error);
    res.status(500).json({ 
      message: 'Database connection error',
      error: error.message,
      code: error.code
    });
  }
};

exports.getAlquileresByEquipo = async (req, res) => {
  try {
    const alquileres = await Alquiler.getByEquipoId(req.params.equipoId);
    res.json(alquileres);
  } catch (error) {
    console.error('Database Error:', error);
    res.status(500).json({ 
      message: 'Database connection error',
      error: error.message,
      code: error.code
    });
  }
};