const { assignTecnicoToRobot, addFicha, checkFinished } = require('../models/incidentesRobotsTecnicosModel');
const { setDisponibilidad } = require('../models/tecnicosModel');
const { setFechaEsperaAprovacion } = require('../models/incidentesModel');

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
            console.log(allDescribed)
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

module.exports = {
    assignTecnico,
    uploadFicha
}