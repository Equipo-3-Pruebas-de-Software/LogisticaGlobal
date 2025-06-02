const express = require('express');
const router = express.Router();
const { getAllRobots, actualizarRobot, borrarRobot , registrarRobot } = require('../controllers/robotsController');

router.post('/', registrarRobot);
router.get('/', getAllRobots);
router.patch('/actualizar-robot', actualizarRobot);
router.patch('/eliminar-robot', borrarRobot);


module.exports = router;
