const Mantenimiento = require('../models/mantenimiento.model');

class MantenimientoController {
    static async getAll(req, res) {
        try {
            const mantenimientos = await Mantenimiento.getAll();
            res.json(mantenimientos);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    static async getById(req, res) {
        try {
            const mantenimiento = await Mantenimiento.getById(req.params.id);
            if (mantenimiento) {
                res.json(mantenimiento);
            } else {
                res.status(404).json({ message: 'Mantenimiento no encontrado' });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    static async create(req, res) {
        try {
            const nuevoMantenimiento = await Mantenimiento.create(req.body);
            res.status(201).json(nuevoMantenimiento);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    static async update(req, res) {
        try {
            const mantenimiento = await Mantenimiento.getById(req.params.id);
            if (mantenimiento) {
                const mantenimientoActualizado = await Mantenimiento.update(req.params.id, req.body);
                res.json(mantenimientoActualizado);
            } else {
                res.status(404).json({ message: 'Mantenimiento no encontrado' });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    static async delete(req, res) {
        try {
            const mantenimiento = await Mantenimiento.getById(req.params.id);
            if (mantenimiento) {
                await Mantenimiento.delete(req.params.id);
                res.json({ message: 'Mantenimiento eliminado exitosamente' });
            } else {
                res.status(404).json({ message: 'Mantenimiento no encontrado' });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    static async getByArticuloId(req, res) {
        try {
            const mantenimientos = await Mantenimiento.getByArticuloId(req.params.articulo_id);
            res.json(mantenimientos);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = MantenimientoController;