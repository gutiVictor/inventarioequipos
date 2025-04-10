const Categoria = require('../models/categoria.model');

const categoriaController = {
  getAllCategorias: async (req, res) => {
    try {
      const categorias = await Categoria.getAll();
      res.json(categorias);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getCategoriaById: async (req, res) => {
    try {
      const categoria = await Categoria.getById(req.params.id);
      if (!categoria) {
        return res.status(404).json({ message: 'Categoría no encontrada' });
      }
      res.json(categoria);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  createCategoria: async (req, res) => {
    try {
      const result = await Categoria.create(req.body);
      res.status(201).json({ id: result.insertId, ...req.body });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  updateCategoria: async (req, res) => {
    try {
      const result = await Categoria.update(req.params.id, req.body);
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Categoría no encontrada' });
      }
      res.json({ id: req.params.id, ...req.body });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  deleteCategoria: async (req, res) => {
    try {
      const result = await Categoria.delete(req.params.id);
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Categoría no encontrada' });
      }
      res.json({ message: 'Categoría eliminada correctamente' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getArticulosByCategoria: async (req, res) => {
    try {
      const articulos = await Categoria.getArticulos(req.params.id);
      res.json(articulos);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = categoriaController;