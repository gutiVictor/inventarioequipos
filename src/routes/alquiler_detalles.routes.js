const express = require('express');
const router = express.Router();
const alquilerDetallesController = require('../controllers/alquiler_detalles.controller');

// Rutas básicas CRUD
router.get('/', alquilerDetallesController.getAll);
router.get('/:id', alquilerDetallesController.getById);
router.post('/', alquilerDetallesController.create);
router.put('/:id', alquilerDetallesController.update);
router.delete('/:id', alquilerDetallesController.delete);

// Ruta específica para obtener detalles por alquiler
router.get('/alquiler/:alquiler_id', alquilerDetallesController.getByAlquilerId);

module.exports = router;