const db = require('../config/db');
const { createIncidente, updateIncidenteAsignacion } = require('../models/incidentesModel');
const { addRobotToIncidente } = require('../models/incidentesRobotsTecnicosModel');
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

const updateIncident = (req, res) => {
    const { id_incidente, supervisor_asignado, prioridad, gravedad } = req.body;
  
    if (!id_incidente || !supervisor_asignado || prioridad === undefined || !gravedad) {
      return res.status(400).json({ error: 'Datos incompletos para asignación' });
    }
    console.log(id_incidente)
    updateIncidenteAsignacion({ id_incidente, supervisor_asignado, prioridad, gravedad }, (err, result) => {
      if (err) {
        console.error('[UPDATE ERROR]', err.sqlMessage);
        return res.status(500).json({ error: 'Error actualizando incidente' });
      }
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Incidente no encontrado' });
      }
  
      res.json({ success: true, message: 'Incidente actualizado correctamente' });
    });
};

module.exports = {
    createIncidenteWithRobots,
    updateIncident
  };
  