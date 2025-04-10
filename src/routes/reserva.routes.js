const express = require('express');
const router = express.Router();
const reservaController = require('../controllers/reserva.controller');

router.get('/', reservaController.getAllReservas);
router.get('/:id', reservaController.getReservaById);
router.post('/', reservaController.createReserva);
router.put('/:id', reservaController.updateReserva);
router.delete('/:id', reservaController.deleteReserva);

// Additional routes for filtering
router.get('/cliente/:clienteId', reservaController.getReservasByCliente);
router.get('/equipo/:equipoId', reservaController.getReservasByEquipo);
router.get('/activas', reservaController.getReservasActivas);

module.exports = router;