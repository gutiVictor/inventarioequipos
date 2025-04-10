const Reserva = require('../models/reserva.model');

class ReservaController {
    static async getAllReservas(req, res) {
        try {
            const reservas = await Reserva.getAll();
            res.json(reservas);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    static async getReservaById(req, res) {
        try {
            const reserva = await Reserva.getById(req.params.id);
            if (reserva) {
                res.json(reserva);
            } else {
                res.status(404).json({ message: 'Reserva no encontrada' });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    static async createReserva(req, res) {
        try {
            // Validaciones básicas
            if (!req.body.cliente_id || !req.body.articulo_id || !req.body.fecha_inicio || !req.body.fecha_fin) {
                return res.status(400).json({ message: 'Faltan campos requeridos' });
            }
    
            if (new Date(req.body.fecha_inicio) > new Date(req.body.fecha_fin)) {
                return res.status(400).json({ message: 'La fecha de inicio no puede ser posterior a la fecha fin' });
            }
    
            // Verificar disponibilidad
            const disponible = await Reserva.verificarDisponibilidad(
                req.body.articulo_id,
                req.body.fecha_inicio,
                req.body.fecha_fin
            );
    
            if (!disponible) {
                return res.status(409).json({ message: 'El artículo no está disponible en las fechas solicitadas' });
            }
    
            const nuevaReserva = await Reserva.create(req.body);
            res.status(201).json(nuevaReserva);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    static async updateReserva(req, res) {
        try {
            // Validaciones
            if (req.body.fecha_inicio && req.body.fecha_fin && 
                new Date(req.body.fecha_inicio) > new Date(req.body.fecha_fin)) {
                return res.status(400).json({ message: 'La fecha de inicio no puede ser posterior a la fecha fin' });
            }
    
            const reserva = await Reserva.getById(req.params.id);
            if (!reserva) {
                return res.status(404).json({ message: 'Reserva no encontrada' });
            }
    
            // Si se cambian fechas o artículo, verificar disponibilidad
            if (req.body.fecha_inicio || req.body.fecha_fin || req.body.articulo_id) {
                const articuloId = req.body.articulo_id || reserva.articulo_id;
                const fechaInicio = req.body.fecha_inicio || reserva.fecha_inicio;
                const fechaFin = req.body.fecha_fin || reserva.fecha_fin;
    
                const disponible = await Reserva.verificarDisponibilidad(
                    articuloId,
                    fechaInicio,
                    fechaFin
                );
    
                if (!disponible) {
                    return res.status(409).json({ message: 'El artículo no está disponible en las fechas solicitadas' });
                }
            }
    
            const reservaActualizada = await Reserva.update(req.params.id, req.body);
            res.json(reservaActualizada);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    static async deleteReserva(req, res) {
        try {
            const reserva = await Reserva.getById(req.params.id);
            if (reserva) {
                await Reserva.delete(req.params.id);
                res.json({ message: 'Reserva eliminada exitosamente' });
            } else {
                res.status(404).json({ message: 'Reserva no encontrada' });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    static async getReservasByCliente(req, res) {
        try {
            const reservas = await Reserva.getByClienteId(req.params.clienteId);
            res.json(reservas);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    static async getReservasByEquipo(req, res) {
        try {
            const reservas = await Reserva.getByArticuloId(req.params.equipoId);
            res.json(reservas);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    static async getReservasActivas(req, res) {
        try {
            const reservas = await Reserva.getAll();
            const reservasActivas = reservas.filter(reserva => 
                reserva.estado === 'pendiente' || reserva.estado === 'confirmada'
            );
            res.json(reservasActivas);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = ReservaController;