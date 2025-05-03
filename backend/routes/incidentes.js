const express = require('express');
const router = express.Router();
const { createIncidenteWithRobots, updateIncident } = require('../controllers/incidentesController');

router.post('/', createIncidenteWithRobots);
router.patch('/', updateIncident);

module.exports = router;
