const express = require('express');
const router = express.Router();
const { createIncidenteWithRobots, updateIncident, getIncidente, getAllIncidentes, finalUpdateIncidente } = require('../controllers/incidentesController');

router.get('/', getAllIncidentes);
router.get('/:id_incidente', getIncidente);
router.post('/', createIncidenteWithRobots);
router.patch('/', updateIncident);
router.patch('/resolver', finalUpdateIncidente);

module.exports = router;
