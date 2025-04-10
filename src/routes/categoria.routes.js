const express = require('express');
const router = express.Router();
const categoriaController = require('../controllers/categoria.controller');

router.get('/', categoriaController.getAllCategorias);
router.get('/:id', categoriaController.getCategoriaById);
router.post('/', categoriaController.createCategoria);
router.put('/:id', categoriaController.updateCategoria);
router.delete('/:id', categoriaController.deleteCategoria);

// Additional route for getting articles in a category
router.get('/:id/articulos', categoriaController.getArticulosByCategoria);

module.exports = router;