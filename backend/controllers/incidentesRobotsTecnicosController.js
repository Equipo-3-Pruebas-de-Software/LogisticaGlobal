const db = require('../config/db');
const { getRobotsByTecnico, assignTecnicoToRobot, addFicha, checkFinished, getDescripcion } = require('../models/incidentesRobotsTecnicosModel');
const { setDisponibilidad } = require('../models/tecnicosModel');
const { setFechaEsperaAprovacion } = require('../models/incidentesModel');
const { updateEstadoRobot } = require('../models/robotsModel');

const assignTecnico = (req, res) => {
  const { id_incidente, id_robot, rut_tecnico } = req.body;

  if (!id_incidente || !id_robot || !rut_tecnico) {
    return res.status(400).json({ error: 'Faltan datos requeridos' });
  }

  db.beginTransaction((err) => {
    if (err) {
        return db.rollback(() => res.status(500).json({ error: 'Error iniciando transacción' }));
    }

    assignTecnicoToRobot(id_incidente, id_robot, rut_tecnico, (err2, result) => {
      if (err2) {
        console.error('[ASIGNACIÓN TECNICO ERROR]', err.sqlMessage);
        return db.rollback(() => res.status(500).json({ error: 'Error asignando técnico al robot' }));
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Incidente/robot no encontrado' });
      }

      setDisponibilidad(rut_tecnico, 0, (err2) => {
        if (err2) {
          console.error('[ACTUALIZAR DISPONIBILIDAD ERROR]', err2.sqlMessage);
          return db.rollback(() => res.status(500).json({ error: 'Error actualizando disponibilidad del técnico' }));
        }

        updateEstadoRobot(id_robot, "en reparación", (err3) => {
          if (err3) {
            console.error('[ACTUALIZAR ESTADO ERROR]', err3.sqlMessage);
            return db.rollback(() => res.status(500).json({ error: 'Error actualizando estado del robot' }));
          }
          db.commit((err4) => {
            if (err4) {
              return db.rollback(() => res.status(500).json({ error: 'Error al confirmar transacción' }));
            }
            res.status(201).json({ success: true, message: 'Técnico asignado correctamente' });
          });
        });
      });
    });
  });
};

const getRobotsForTecnico = (req, res) => {
  const { rut_tecnico } = req.params;

  if (!rut_tecnico) {
    return res.status(400).json({ error: 'El rut del técnico es requerido' });
  }

  getRobotsByTecnico(rut_tecnico, (err, robots) => {
    if (err) {
      console.error('[GET ROBOTS ERROR]', err.sqlMessage);  // Aquí puedes ver si la consulta falla
      return res.status(500).json({ error: 'Error obteniendo robots asignados' });
    }

    res.status(200).json(robots);
  });
};

const uploadFicha = (req, res) => {
    const { id_incidente, id_robot, descripcion } = req.body;

    if (!id_incidente || !id_robot || !descripcion ) {
        return res.status(400).json({ error: 'Faltan datos requeridos' });
    }

    addFicha(id_incidente, id_robot, descripcion, (err, result) => {
        if (err) {
            console.error('[SUBIDA FICHA ERROR]', err.sqlMessage);
            return res.status(500).json({ error: 'Error al subir la ficha' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Incidente/tecnico no encontrado' });
        }

        checkFinished(id_incidente, (err2, allDescribed) => {
            if (err2) {
                console.error('[VERIFICACIÓN DESCRIPCIONES ERROR]', err2.sqlMessage);
                return res.status(500).json({ error: 'Error verificando descripciones' });
            }
            if (!allDescribed) {
                return res.json({ success: true, message: 'Ficha subida, no todos los robots tienen ficha' });
            }

            setFechaEsperaAprovacion(id_incidente, (err3) => {
                if (err3) {
                    console.error('[SET FECHA ERROR]', err3.sqlMessage);
                    return res.status(500).json({ error: 'Descripción actualizada, pero error al actualizar fecha_espera_aprovacion' });
                }

                res.json({ success: true, message: 'Ficha y fecha_espera_aprovacion registrada' });
            });
        });
    });
};

const getFicha = (req, res) => {
  const { id_incidente, id_robot, rut_tecnico } = req.body;
  if (!id_incidente || !id_robot || !rut_tecnico ) {
        return res.status(400).json({ error: 'Faltan datos requeridos' });
  }
  getDescripcion(id_incidente, id_robot, rut_tecnico, (err, result) => {
    if (err) {
      console.error('[GET DESCRIPCION ERROR]', err.sqlMessage);
      return res.status(500).json({ error: 'Error al obtener la ficha' });
    }
    if (!result) {
      return res.status(404).json({ error: 'Ficha no encontrada' })
    }
    res.status(200).json(result);
  });
};


module.exports = {
    assignTecnico,
    getRobotsForTecnico,
    uploadFicha,
    getFicha
}