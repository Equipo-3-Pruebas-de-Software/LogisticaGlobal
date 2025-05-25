const express = require('express');
const router = express.Router();
const { getAllRobots, actualizarRobot } = require('../controllers/robotsController');

// Obtener todos los robots (ya existente)
router.get('/', getAllRobots);
router.patch('/actualizar-robot', actualizarRobot);


module.exports = router;
