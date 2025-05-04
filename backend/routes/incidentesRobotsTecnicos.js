const express = require('express');
const router = express.Router();
const { assignTecnico, uploadFicha } = require('../controllers/incidentesRobotsTecnicosController');

router.patch('/asignar-tecnico', assignTecnico);
router.patch('/subir-ficha', uploadFicha);

module.exports = router;
