const db = require('../config/db');
const { createIncidente } = require('../models/incidentesModel');
const { addRobotToIncidente } = require('../models/incidentesRobotsModel');
const { updateEstadoRobot } = require('../models/robotsModel');

const createIncidenteWithRobots = (req, res) => {
  const { lugar, descripcion, robots } = req.body;

  if (!lugar || !descripcion || !Array.isArray(robots) || robots.length === 0) {
    return res.status(400).json({ error: 'Datos incompletos' });
  }

  db.beginTransaction((err) => {
    if (err) return res.status(500).json({ error: 'Error iniciando transacción' });

    createIncidente({ lugar, descripcion }, (err, incidenteId) => {
      if (err) return db.rollback(() => res.status(500).json({ error: 'Error creando incidente' }));

      let completed = 0;
      for (const robotId of robots) {
        addRobotToIncidente(robotId, incidenteId, (err) => {
          if (err) return db.rollback(() => res.status(500).json({ error: 'Error agregando robot al incidente' }));

          updateEstadoRobot(robotId, 'fuera de servicio', (err) => {
            if (err) return db.rollback(() => res.status(500).json({ error: 'Error actualizando estado del robot' }));

            completed++;
            if (completed === robots.length) {
              db.commit((err) => {
                if (err) return db.rollback(() => res.status(500).json({ error: 'Error al confirmar transacción' }));
                res.status(201).json({ success: true, incidenteId });
              });
            }
          });
        });
      }
    });
  });
};

module.exports = { createIncidenteWithRobots };
