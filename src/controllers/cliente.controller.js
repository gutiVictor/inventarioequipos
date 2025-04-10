const Cliente = require('../models/cliente.model');

exports.getAllClientes = async (req, res) => {
  try {
    const clientes = await Cliente.getAll();
    res.json(clientes);
  } catch (error) {
    console.error('Database Error:', error);
    res.status(500).json({ 
      message: 'Database connection error',
      error: error.message,
      code: error.code
    });
  }
};

exports.getClienteById = async (req, res) => {
  try {
    const cliente = await Cliente.getById(req.params.id);
    if (!cliente) {
      return res.status(404).json({ message: 'Cliente not found' });
    }
    res.json(cliente);
  } catch (error) {
    console.error('Database Error:', error);
    res.status(500).json({ 
      message: 'Database connection error',
      error: error.message,
      code: error.code
    });
  }
};

exports.createCliente = async (req, res) => {
  try {
    const result = await Cliente.create(req.body);
    res.status(201).json({
      message: 'Cliente created successfully',
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

exports.updateCliente = async (req, res) => {
  try {
    const result = await Cliente.update(req.params.id, req.body);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Cliente not found' });
    }
    res.json({ message: 'Cliente updated successfully' });
  } catch (error) {
    console.error('Database Error:', error);
    res.status(500).json({ 
      message: 'Database connection error',
      error: error.message,
      code: error.code
    });
  }
};

exports.deleteCliente = async (req, res) => {
  try {
    const result = await Cliente.delete(req.params.id);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Cliente not found' });
    }
    res.json({ message: 'Cliente deleted successfully' });
  } catch (error) {
    console.error('Database Error:', error);
    res.status(500).json({ 
      message: 'Database connection error',
      error: error.message,
      code: error.code
    });
  }
};