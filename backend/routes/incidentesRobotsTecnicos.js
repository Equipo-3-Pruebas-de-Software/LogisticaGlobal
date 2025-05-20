const express = require('express');
const router = express.Router();
const { assignTecnico, uploadFicha, getRobotsForTecnico, getFicha } = require('../controllers/incidentesRobotsTecnicosController');

router.patch('/asignar-tecnico', assignTecnico);
router.patch('/subir-ficha', uploadFicha);
router.get('/robots-asignados/:rut_tecnico', getRobotsForTecnico); //obtener robots asignados a x tecnico
router.get('/obtener-ficha', getFicha);

module.exports = router;
