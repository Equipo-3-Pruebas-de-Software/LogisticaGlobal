const { readAllRobots, updateLugarRobot, deleteRobot , crearRobot } = require('../models/robotsModel');

const registrarRobot = (req, res) => {
  const { lugar_trabajo } = req.body;

  if (!lugar_trabajo) {
    return res.status(400).json({ error: 'El campo lugar_trabajo es obligatorio' });
  }

  crearRobot(lugar_trabajo, (err, result) => {
    if (err) {
      console.error('[ERROR AL CREAR ROBOT]', err);
      return res.status(500).json({ error: 'Error al registrar el robot' });
    }

    res.status(201).json({
      message: 'Robot registrado exitosamente',
      robot_id: result.insertId
    });
  });
};

const getAllRobots = async (req, res) => {
    try {
      const incidentes = await readAllRobots();
      res.status(200).json(incidentes);
    } catch (error) {
      console.error('Error al obtener robots:', error);
      res.status(500).json({ message: 'Error al obtener los robots' });
    }
};

const actualizarRobot = (req, res) => {
  const { id, lugar } = req.body;

  if ( !id || !lugar ) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }
  
  return updateLugarRobot(id, lugar, (err, result) => {
    if (err) return res.status(500).json({ error: 'Error al actualizar lugar de trabajo' });
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Robot no encontrado' });
    }
    return res.status(200).json({ message: 'Lugar de trabajo actualizado correctamente' });
  });
};

const borrarRobot = (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }

  return deleteRobot(id, (err, result) => {
    if (err) return res.status(500).json({ error: 'Error al borrar al robot' });
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Robot no encontrado' });
    }
    return res.status(200).json({ message: 'Robot eliminado correctamente' });
  });
};
  
module.exports = {
  registrarRobot,
  getAllRobots,
  actualizarRobot,
  borrarRobot
};