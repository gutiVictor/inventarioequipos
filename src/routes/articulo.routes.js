const express = require('express');
const router = express.Router();
const articuloController = require('../controllers/articulo.controller');

router.get('/', articuloController.getAllArticulos);
router.get('/:id', articuloController.getArticuloById);
router.post('/', articuloController.createArticulo);
router.put('/:id', articuloController.updateArticulo);
router.delete('/:id', articuloController.deleteArticulo);

// Additional routes for filtering and stock management
router.get('/categoria/:categoriaId', articuloController.getArticulosByCategoria);
router.put('/:id/stock', articuloController.updateArticuloStock);

module.exports = router;