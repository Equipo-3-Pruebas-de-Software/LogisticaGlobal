const express = require('express');
const router = express.Router();
const { createIncidenteWithRobots, updateIncident, getIncidente, getAllIncidentes, finalUpdateIncidente } = require('../controllers/incidentesController');
const { getDashboardData } = require('../models/dashboardModel');


router.get('/', getAllIncidentes);

router.get('/dashboard', (req, res) => {
  getDashboardData((err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Error al obtener los datos del dashboard' });
    }
    res.json(data);
  });
});

router.get('/:id_incidente', getIncidente);
router.post('/', createIncidenteWithRobots);
router.patch('/', updateIncident);
router.patch('/resolver', finalUpdateIncidente);



module.exports = router;
