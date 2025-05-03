const express = require('express');
const router = express.Router();
const { createIncidenteWithRobots, updateIncident, getIncidente } = require('../controllers/incidentesController');

router.get('/', getIncidente);
router.post('/', createIncidenteWithRobots);
router.patch('/', updateIncident);

module.exports = router;
