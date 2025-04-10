const express = require('express');
const router = express.Router();
const UsuarioController = require('../controllers/usuario.controller');

// Get all users
router.get('/', UsuarioController.getAllUsuarios);

// Get user by ID
router.get('/:id', UsuarioController.getById);

// Create new user
router.post('/', UsuarioController.create);

// Update user
router.put('/:id', UsuarioController.update);

// Delete user
router.delete('/:id', UsuarioController.delete);

// User login
router.post('/login', UsuarioController.login);

module.exports = router;