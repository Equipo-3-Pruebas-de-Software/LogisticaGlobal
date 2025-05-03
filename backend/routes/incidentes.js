const express = require('express');
const router = express.Router();
const { createIncidenteWithRobots } = require('../controllers/incidentesController');

router.post('/', createIncidenteWithRobots);

module.exports = router;
