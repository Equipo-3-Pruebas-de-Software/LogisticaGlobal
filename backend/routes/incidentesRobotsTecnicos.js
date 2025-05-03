const express = require('express');
const router = express.Router();
const { assignTecnico } = require('../controllers/incidentesRobotsTecnicosController');

router.patch('/asignar-tecnico', assignTecnico);

module.exports = router;
