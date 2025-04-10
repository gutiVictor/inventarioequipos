const express = require('express');
const router = express.Router();
const MantenimientoController = require('../controllers/mantenimiento.controller');

// Get all mantenimientos
router.get('/', MantenimientoController.getAll);

// Get mantenimiento by ID
router.get('/:id', MantenimientoController.getById);

// Get mantenimientos by articulo ID
router.get('/articulo/:articulo_id', MantenimientoController.getByArticuloId);

// Create new mantenimiento
router.post('/', MantenimientoController.create);

// Update mantenimiento
router.put('/:id', MantenimientoController.update);

// Delete mantenimiento
router.delete('/:id', MantenimientoController.delete);

module.exports = router;