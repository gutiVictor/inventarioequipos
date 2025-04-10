const Equipo = require('../models/equipo.model');

exports.getAllEquipos = async (req, res) => {
  try {
    const equipos = await Equipo.getAll();
    res.json(equipos);
  } catch (error) {
    console.error('Database Error:', error);
    console.error('Database Error:', error);
    res.status(500).json({ 
      message: 'Database connection error',
      error: error.message,
      code: error.code
    });
  }
};

exports.getEquipoById = async (req, res) => {
  try {
    const equipo = await Equipo.getById(req.params.id);
    if (!equipo) {
      return res.status(404).json({ message: 'Equipo not found' });
    }
    res.json(equipo);
  } catch (error) {
    console.error('Database Error:', error);
    console.error('Database Error:', error);
    res.status(500).json({ 
      message: 'Database connection error',
      error: error.message,
      code: error.code
    });
  }
};

exports.createEquipo = async (req, res) => {
  try {
    const result = await Equipo.create(req.body);
    res.status(201).json({
      message: 'Equipo created successfully',
      id: result.insertId
    });
  } catch (error) {
    console.error('Database Error:', error);
    console.error('Database Error:', error);
    res.status(500).json({ 
      message: 'Database connection error',
      error: error.message,
      code: error.code
    });
  }
};

exports.updateEquipo = async (req, res) => {
  try {
    const result = await Equipo.update(req.params.id, req.body);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Equipo not found' });
    }
    res.json({ message: 'Equipo updated successfully' });
  } catch (error) {
    console.error('Database Error:', error);
    console.error('Database Error:', error);
    res.status(500).json({ 
      message: 'Database connection error',
      error: error.message,
      code: error.code
    });
  }
};

exports.deleteEquipo = async (req, res) => {
  try {
    const result = await Equipo.delete(req.params.id);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Equipo not found' });
    }
    res.json({ message: 'Equipo deleted successfully' });
  } catch (error) {
    console.error('Database Error:', error);
    console.error('Database Error:', error);
    res.status(500).json({ 
      message: 'Database connection error',
      error: error.message,
      code: error.code
    });
  }
};