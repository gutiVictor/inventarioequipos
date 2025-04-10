const AlquilerDetalle = require('../models/alquiler_detalles.model');

exports.getAll = async (req, res) => {
    try {
        const detalles = await AlquilerDetalle.getAll();
        res.json(detalles);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getById = async (req, res) => {
    try {
        const detalle = await AlquilerDetalle.getById(req.params.id);
        if (!detalle) {
            return res.status(404).json({ error: 'Detalle de alquiler no encontrado' });
        }
        res.json(detalle);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.create = async (req, res) => {
    try {
        const nuevoDetalle = await AlquilerDetalle.create(req.body);
        res.status(201).json(nuevoDetalle);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.update = async (req, res) => {
    try {
        const detalleActualizado = await AlquilerDetalle.update(req.params.id, req.body);
        res.json(detalleActualizado);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.delete = async (req, res) => {
    try {
        await AlquilerDetalle.delete(req.params.id);
        res.json({ message: 'Detalle de alquiler eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getByAlquilerId = async (req, res) => {
    try {
        const detalles = await AlquilerDetalle.getByAlquilerId(req.params.alquiler_id);
        res.json(detalles);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};