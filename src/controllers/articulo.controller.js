const Articulo = require('../models/articulo.model');

const articuloController = {
  getAllArticulos: async (req, res) => {
    try {
      const articulos = await Articulo.getAll();
      res.json(articulos);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getArticuloById: async (req, res) => {
    try {
      const articulo = await Articulo.getById(req.params.id);
      if (!articulo) {
        return res.status(404).json({ message: 'Artículo no encontrado' });
      }
      res.json(articulo);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  createArticulo: async (req, res) => {
    try {
      const result = await Articulo.create(req.body);
      res.status(201).json({ id: result.insertId, ...req.body });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  updateArticulo: async (req, res) => {
    try {
      const result = await Articulo.update(req.params.id, req.body);
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Artículo no encontrado' });
      }
      res.json({ id: req.params.id, ...req.body });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  deleteArticulo: async (req, res) => {
    try {
      const result = await Articulo.delete(req.params.id);
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Artículo no encontrado' });
      }
      res.json({ message: 'Artículo eliminado correctamente' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getArticulosByCategoria: async (req, res) => {
    try {
      const articulos = await Articulo.getByCategoriaId(req.params.categoriaId);
      res.json(articulos);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  updateArticuloStock: async (req, res) => {
    try {
      const { cantidad } = req.body;
      if (cantidad === undefined) {
        return res.status(400).json({ message: 'La cantidad es requerida' });
      }
      const result = await Articulo.updateStock(req.params.id, cantidad);
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Artículo no encontrado' });
      }
      res.json({ message: 'Stock actualizado correctamente' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = articuloController;