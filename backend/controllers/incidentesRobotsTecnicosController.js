const { assignTecnicoToRobot } = require('../models/incidentesRobotsTecnicosModel');
const { setDisponibilidad } = require('../models/tecnicosModel');
const { getRobotsByTecnico } = require('../models/incidentesRobotsTecnicosModel');

const assignTecnico = (req, res) => {
  const { id_incidente, id_robot, rut_tecnico } = req.body;

  if (!id_incidente || !id_robot || !rut_tecnico) {
    return res.status(400).json({ error: 'Faltan datos requeridos' });
  }

  assignTecnicoToRobot(id_incidente, id_robot, rut_tecnico, (err, result) => {
    if (err) {
      console.error('[ASIGNACIÓN TECNICO ERROR]', err.sqlMessage);
      return res.status(500).json({ error: 'Error asignando técnico al robot' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Incidente/robot no encontrado' });
    }

    setDisponibilidad(rut_tecnico, 0, (err2) => {
      if (err2) {
        console.error('[ACTUALIZAR DISPONIBILIDAD ERROR]', err2.sqlMessage);
        return res.status(500).json({ error: 'Error actualizando disponibilidad del técnico' });
      }

      res.json({ success: true, message: 'Técnico asignado correctamente' });
    });
  });
};

const getRobotsForTecnico = (req, res) => {
  const { rut_tecnico } = req.params;

  if (!rut_tecnico) {
    return res.status(400).json({ error: 'El rut del técnico es requerido' });
  }

  console.log('Buscando robots para el técnico:', rut_tecnico);  // Agregar este log

  getRobotsByTecnico(rut_tecnico, (err, robots) => {
    if (err) {
      console.error('[GET ROBOTS ERROR]', err.sqlMessage);  // Aquí puedes ver si la consulta falla
      return res.status(500).json({ error: 'Error obteniendo robots asignados' });
    }

    console.log('Robots asignados:', robots);  // Verifica si robots tiene datos

    res.json(robots);
  });
};


module.exports = {
    assignTecnico,
    getRobotsForTecnico
}