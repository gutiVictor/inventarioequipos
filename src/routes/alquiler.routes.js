const express = require('express');
const router = express.Router();
const alquilerController = require('../controllers/alquiler.controller');

router.get('/', alquilerController.getAllAlquileres);
router.get('/:id', alquilerController.getAlquilerById);
router.post('/', alquilerController.createAlquiler);
router.put('/:id', alquilerController.updateAlquiler);
router.delete('/:id', alquilerController.deleteAlquiler);

// Additional routes for filtering
router.get('/cliente/:clienteId', alquilerController.getAlquileresByCliente);
router.get('/equipo/:equipoId', alquilerController.getAlquileresByEquipo);

module.exports = router;