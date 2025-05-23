const db = require('../config/db');
const { createIncidente, updateIncidenteAsignacion, readIncidente, readAllIncidentes, resolveIncidente } = require('../models/incidentesModel');
const { addRobotToIncidente, readIncidenteRobotsTecnicos } = require('../models/incidentesRobotsTecnicosModel');
const { updateEstadoRobot } = require('../models/robotsModel');
const { checkFirma } = require('../models/supervisoresModel');
const { setDisponibilidad } = require('../models/tecnicosModel');

const createIncidenteWithRobots = (req, res) => {
  const { lugar, descripcion, robots , jefe_turno_asignado} = req.body;

  if (!lugar || !descripcion || !jefe_turno_asignado ||!Array.isArray(robots) || robots.length === 0) {
    return res.status(400).json({ error: 'Datos incompletos' });
  }

  db.beginTransaction((err) => {
    if (err) return res.status(500).json({ error: 'Error iniciando transacción' });

    createIncidente({ lugar, descripcion , jefe_turno_asignado }, (err, incidenteId) => {
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

const getIncidente = (req, res) => {
  const { id_incidente } = req.params;

  if (!id_incidente) {
    return res.status(400).json({ error: 'Falta id_incidente' });
  }

  readIncidente(id_incidente, (err, incidente) => {
    if (err) {
      console.error('[GET INCIDENTE]', err.sqlMessage);
      return res.status(500).json({ error: 'Error obteniendo incidente' });
    }

    if (!incidente) {
      return res.status(404).json({ error: 'Incidente no encontrado' });
    }

    readIncidenteRobotsTecnicos(id_incidente, (err2, detalles) => {
      if (err2) {
        console.error('[GET DETALLES]', err2.sqlMessage);
        return res.status(500).json({ error: 'Error obteniendo detalles' });
      }

      res.json({ incidente, detalles });
    });
  });
};

const getAllIncidentes = async (req, res) => {
  try {
    const incidentes = await readAllIncidentes();
    res.status(200).json(incidentes);
  } catch (error) {
    console.error('Error al obtener incidentes:', error);
    res.status(500).json({ message: 'Error al obtener incidentes' });
  }
};

const finalUpdateIncidente = (req, res) => {
  const { rut_supervisor, firma, id_incidente } = req.body;
  checkFirma(rut_supervisor, firma, (err, check) => {
    if (err) {
      console.error('[GET FIRMA]', err.sqlMessage);
      return res.status(500).json({ error: 'Error obteniendo la firma' });
    }

    if (!check) {
      return res.status(403).json({ error: 'Firma no coincide con la almacenada en base de datos' });
    }

    db.beginTransaction((err2) => {
      if (err2) {
        return db.rollback(() => res.status(500).json({ error: 'Error iniciando transacción' }));
      }
      
      resolveIncidente(id_incidente, (err3, result) => {
        if (err3) {
          console.error('[UPDATE ERROR]', err3.sqlMessage);
          return db.rollback(() => res.status(500).json({ error: 'Error actualizando incidente' }));
        }

        if (result.affectedRows === 0) {
          return db.rollback(() => res.status(404).json({ error: 'Incidente no encontrado' }));
        }

        readIncidenteRobotsTecnicos(id_incidente, (err4, detalles) => {
          if (err4) {
            console.error('[GET DETALLES]', err4.sqlMessage);
            return db.rollback(() => res.status(500).json({ error: 'Error obteniendo detalles' }));
          }

          let completed = 0;
          for (const detalle of detalles) {
            setDisponibilidad(detalle.rut_tecnico, 1, (err5) => {
              if (err5) {
                console.error('[ACTUALIZAR DISPONIBILIDAD ERROR]', err5.sqlMessage);
                return db.rollback(() => res.status(500).json({ error: 'Error actualizando disponibilidad del técnico' }));
              }

              updateEstadoRobot(detalle.id_robot, 'Operativo', (err6) => {
                if (err6) {
                  return db.rollback(() => res.status(500).json({ error: 'Error actualizando estado del robot' }));
                }
                completed++;
                if (completed === detalles.length) {
                  db.commit((err7) => {
                    if (err7) {
                      return db.rollback(() => res.status(500).json({ error: 'Error al confirmar transacción' }));
                    }
                    res.status(201).json({ success: true, id_incidente });
                  });
                }
              });
            });
          };
        });
      });
    });
  });
};

module.exports = {
    createIncidenteWithRobots,
    updateIncident,
    getIncidente,
    getAllIncidentes,
    finalUpdateIncidente
};