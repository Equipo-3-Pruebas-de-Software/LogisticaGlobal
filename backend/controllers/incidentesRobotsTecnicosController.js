const { assignTecnicoToRobot } = require('../models/incidentesRobotsTecnicosModel');
const { setDisponibilidad } = require('../models/tecnicosModel');

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

module.exports = {
    assignTecnico
}