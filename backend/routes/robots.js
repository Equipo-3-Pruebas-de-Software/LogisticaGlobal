const express = require('express');
const router = express.Router();
const { getAllRobots, actualizarRobot, borrarRobot } = require('../controllers/robotsController');

// Obtener todos los robots (ya existente)
router.get('/', getAllRobots);
router.patch('/actualizar-robot', actualizarRobot);
router.patch('/eliminar-robot', borrarRobot);


module.exports = router;
