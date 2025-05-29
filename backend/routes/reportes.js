const express = require('express');
const router = express.Router();
const {
  createReporte,
  getAllReportes,
  getReporteById
} = require('../controllers/reportesController');

router.post('/', createReporte);
router.get('/', getAllReportes);
router.get('/:id_reporte', getReporteById);

module.exports = router;
