const express = require('express');
const router = express.Router();
const { createIncidenteWithRobots, updateIncident, getIncidente, getAllIncidentes } = require('../controllers/incidentesController');

router.get('/', getAllIncidentes);
router.get('/:id_incidente', getIncidente);
router.post('/', createIncidenteWithRobots);
router.patch('/', updateIncident);


module.exports = router;
