const Sucursal = require('../models/sucursal.model');

exports.getAllSucursales = async (req, res) => {
  try {
    const sucursales = await Sucursal.getAll();
    res.json(sucursales);
  } catch (error) {
    console.error('Database Error:', error);
    res.status(500).json({ 
      message: 'Database connection error',
      error: error.message,
      code: error.code
    });
  }
};

exports.createSucursal = async (req, res) => {
  try {
    const result = await Sucursal.create(req.body);
    res.status(201).json({
      message: 'Sucursal created successfully',
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