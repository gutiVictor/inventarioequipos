const express = require('express');
const router = express.Router();
const sucursalController = require('../controllers/sucursal.controller');

router.get('/', sucursalController.getAllSucursales);
router.post('/', sucursalController.createSucursal);

module.exports = router;