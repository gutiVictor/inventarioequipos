const express = require('express');
const router = express.Router();
const reportController = require('../controllers/report.controller');

// Financial reports
router.get('/financial', reportController.generateFinancialReport);

// Operations reports
router.get('/operations', reportController.generateOperationsReport);

// Maintenance reports
router.get('/maintenance', reportController.generateMaintenanceReport);

// Client reports
router.get('/clients', reportController.generateClientsReport);

// Inventory reports
router.get('/inventory', reportController.generateInventoryReport);

module.exports = router;