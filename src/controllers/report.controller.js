const Report = require('../models/report.model');
const Alquiler = require('../models/alquiler.model');
const Cliente = require('../models/cliente.model');
const Articulo = require('../models/articulo.model');
const Mantenimiento = require('../models/mantenimiento.model');
const { Op } = require('sequelize');

exports.generateFinancialReport = async (req, res) => {
  try {
    const { startDate, endDate, reportType } = req.query;

    switch (reportType) {
      case 'income': {
        // Ingresos por período
        const rentals = await Alquiler.findAll({
          where: {
            fecha_inicio: {
              [Op.between]: [startDate, endDate]
            }
          },
          include: [
            { model: Articulo, attributes: ['nombre', 'costo_alquiler_dia'] }
          ]
        });

        const income = rentals.reduce((acc, rental) => {
          const days = Math.ceil(
            (new Date(rental.fecha_fin) - new Date(rental.fecha_inicio)) / (1000 * 60 * 60 * 24)
          );
          return acc + (days * rental.Articulo.costo_alquiler_dia);
        }, 0);

        res.json({
          total: income,
          details: rentals.map(rental => ({
            articulo: rental.Articulo.nombre,
            ingresos: rental.Articulo.costo_alquiler_dia,
            fecha: rental.fecha_inicio
          }))
        });
        break;
      }

      case 'deposits': {
        // Depósitos vs multas
        const rentals = await Alquiler.findAll({
          where: {
            fecha_inicio: {
              [Op.between]: [startDate, endDate]
            }
          },
          attributes: ['deposito', 'multa']
        });

        const totals = rentals.reduce((acc, rental) => ({
          depositos: acc.depositos + (rental.deposito || 0),
          multas: acc.multas + (rental.multa || 0)
        }), { depositos: 0, multas: 0 });

        res.json(totals);
        break;
      }

      case 'pending': {
        // Pagos pendientes
        const pendingPayments = await Alquiler.findAll({
          where: {
            estado_pago: 'pendiente',
            fecha_inicio: {
              [Op.between]: [startDate, endDate]
            }
          },
          include: [
            { model: Cliente, attributes: ['nombre', 'apellido'] },
            { model: Articulo, attributes: ['nombre'] }
          ]
        });

        res.json(pendingPayments);
        break;
      }

      default:
        res.status(400).json({ message: 'Tipo de reporte no válido' });
    }
  } catch (error) {
    console.error('Error generating financial report:', error);
    res.status(500).json({ message: 'Error al generar el reporte financiero' });
  }
};

exports.generateOperationsReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const rentals = await Alquiler.findAll({
      where: {
        fecha_inicio: {
          [Op.between]: [startDate, endDate]
        }
      },
      include: [
        { model: Articulo, attributes: ['nombre', 'estado'] },
        { model: Cliente, attributes: ['nombre', 'apellido'] }
      ]
    });

    const stats = {
      total_rentals: rentals.length,
      active_rentals: rentals.filter(r => r.estado === 'activo').length,
      completed_rentals: rentals.filter(r => r.estado === 'finalizado').length,
      clients: new Set(rentals.map(r => r.Cliente.id)).size
    };

    res.json(stats);
  } catch (error) {
    console.error('Error generating operations report:', error);
    res.status(500).json({ message: 'Error al generar el reporte de operaciones' });
  }
};

exports.generateMaintenanceReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const maintenanceRecords = await Mantenimiento.findAll({
      where: {
        fecha_programada: {
          [Op.between]: [startDate, endDate]
        }
      },
      include: [{ model: Articulo, attributes: ['nombre'] }]
    });

    const stats = {
      total: maintenanceRecords.length,
      pending: maintenanceRecords.filter(m => m.estado === 'pendiente').length,
      completed: maintenanceRecords.filter(m => m.estado === 'completado').length,
      details: maintenanceRecords.map(m => ({
        articulo: m.Articulo.nombre,
        fecha: m.fecha_programada,
        tipo: m.tipo,
        estado: m.estado
      }))
    };

    res.json(stats);
  } catch (error) {
    console.error('Error generating maintenance report:', error);
    res.status(500).json({ message: 'Error al generar el reporte de mantenimiento' });
  }
};

exports.generateClientsReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const clients = await Cliente.findAll({
      include: [{
        model: Alquiler,
        where: {
          fecha_inicio: {
            [Op.between]: [startDate, endDate]
          }
        },
        required: false
      }]
    });

    const clientStats = clients.map(client => ({
      nombre: `${client.nombre} ${client.apellido}`,
      total_alquileres: client.Alquileres.length,
      monto_total: client.Alquileres.reduce((acc, alq) => acc + alq.monto_total, 0)
    }));

    res.json(clientStats);
  } catch (error) {
    console.error('Error generating clients report:', error);
    res.status(500).json({ message: 'Error al generar el reporte de clientes' });
  }
};

exports.generateInventoryReport = async (req, res) => {
  try {
    const inventory = await Articulo.findAll({
      attributes: [
        'nombre',
        'estado',
        'costo_alquiler_dia',
        'fecha_adquisicion'
      ],
      include: [{
        model: Mantenimiento,
        required: false,
        where: {
          estado: 'pendiente'
        }
      }]
    });

    const stats = {
      total_items: inventory.length,
      available: inventory.filter(item => item.estado === 'disponible').length,
      rented: inventory.filter(item => item.estado === 'alquilado').length,
      maintenance: inventory.filter(item => item.estado === 'mantenimiento').length,
      details: inventory.map(item => ({
        nombre: item.nombre,
        estado: item.estado,
        costo_diario: item.costo_alquiler_dia,
        mantenimientos_pendientes: item.Mantenimientos.length
      }))
    };

    res.json(stats);
  } catch (error) {
    console.error('Error generating inventory report:', error);
    res.status(500).json({ message: 'Error al generar el reporte de inventario' });
  }
};