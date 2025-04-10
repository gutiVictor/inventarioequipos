const HistoricoEstado = require('../models/historico_estado.model');

const historicoEstadoController = {
  getAll: async (req, res) => {
    try {
      const historicos = await HistoricoEstado.getAll();
      res.json(historicos);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getById: async (req, res) => {
    try {
      const historico = await HistoricoEstado.getById(req.params.id);
      if (!historico) {
        return res.status(404).json({ message: 'Registro histórico no encontrado' });
      }
      res.json(historico);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getByArticuloId: async (req, res) => {
    try {
      const historicos = await HistoricoEstado.getByArticuloId(req.params.articulo_id);
      res.json(historicos);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  create: async (req, res) => {
    try {
      const result = await HistoricoEstado.create(req.body);
      res.status(201).json({ id: result.insertId, ...req.body });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  update: async (req, res) => {
    try {
      const result = await HistoricoEstado.update(req.params.id, req.body);
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Registro histórico no encontrado' });
      }
      res.json({ id: req.params.id, ...req.body });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  delete: async (req, res) => {
    try {
      const result = await HistoricoEstado.delete(req.params.id);
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Registro histórico no encontrado' });
      }
      res.json({ message: 'Registro histórico eliminado correctamente' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = historicoEstadoController;