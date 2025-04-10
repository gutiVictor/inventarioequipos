const express = require('express');
const router = express.Router();
const historicoEstadoController = require('../controllers/historico_estado.controller');

// Get all historical records
router.get('/', historicoEstadoController.getAll);

// Get historical record by ID
router.get('/:id', historicoEstadoController.getById);

// Get historical records by article ID
router.get('/articulo/:articulo_id', historicoEstadoController.getByArticuloId);

// Create new historical record
router.post('/', historicoEstadoController.create);

// Update historical record
router.put('/:id', historicoEstadoController.update);

// Delete historical record
router.delete('/:id', historicoEstadoController.delete);

module.exports = router;