const { crearSupervisor, actualizarSupervisor, borrarSupervisor, readAllSupervisores } = require('../models/supervisoresModel');
const { crearJefeTurno, actualizarJefeTurno, borrarJefeTurno } = require('../models/jefeTurnoModel');
const { crearTecnico, actualizarTecnico, borrarTecnico } = require('../models/tecnicosModel');
const { readIncidenteSupervisor } = require('../models/incidentesModel');

const crearFuncionario = (req, res) => {
  const { nombre, rut, rol, password, firma } = req.body;

  if (!nombre || !rut || !rol || !password || (rol === 'supervisor' && !firma)) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }

  if (rol === 'supervisor') {
    return crearSupervisor(rut, nombre, firma, password, (err, result) => {
      if (err) return res.status(500).json({ error: 'Error al crear supervisor' });
      return res.status(200).json({ message: 'Supervisor creado correctamente' });
    });
  }

  if (rol === 'jefe de turno') {
    return crearJefeTurno(rut, nombre, password, (err, result) => {
      if (err) return res.status(500).json({ error: 'Error al crear jefe de turno' });
      return res.status(200).json({ message: 'Jefe de turno creado correctamente' });
    });
  }

  if (rol === 'técnico') {
    return crearTecnico(rut, nombre, password, (err, result) => {
      if (err) return res.status(500).json({ error: 'Error al crear técnico' });
      return res.status(200).json({ message: 'Técnico creado correctamente' });
    });
  }

  return res.status(400).json({ error: 'Rol no válido' });
};

const actualizarFuncionario = (req, res) => {
  const { rut, rol, password, firma } = req.body;

  if ( !rut || !rol || (!password & !firma)) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }

  if (rol === 'supervisor') {
    return actualizarSupervisor(rut, firma, password, (err, result) => {
      if (err) return res.status(500).json({ error: 'Error al actualizar supervisor' });
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Supervisor no encontrado' });
      }
      return res.status(200).json({ message: 'Supervisor actualizado correctamente' });
    });
  }

  if (rol === 'jefe de turno') {
    return actualizarJefeTurno(rut, password, (err, result) => {
      if (err) return res.status(500).json({ error: 'Error al actualizar jefe de turno' });
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Jefe de turno no encontrado' });
      }
      return res.status(200).json({ message: 'Jefe de turno actualizado correctamente' });
    });
  }

  if (rol === 'técnico') {
    return actualizarTecnico(rut, password, (err, result) => {
      if (err) return res.status(500).json({ error: 'Error al actualizar técnico' });
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Técnico no encontrado' });
      }
      return res.status(200).json({ message: 'Técnico actualizado correctamente' });
    });
  }

  return res.status(400).json({ error: 'Rol no válido' });
};

const borrarFuncionario = (req, res) => {
  const { rut, rol } = req.body;

  if (!rut || !rol) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }

  if (rol === 'supervisor') {
    return borrarSupervisor(rut, (err, result) => {
      if (err) return res.status(500).json({ error: 'Error al borrar supervisor' });
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Supervisor no encontrado' });
      }
      return res.status(200).json({ message: 'Supervisor borrado correctamente' });
    });
  }

  if (rol === 'jefe de turno') {
    return borrarJefeTurno(rut, (err, result) => {
      if (err) return res.status(500).json({ error: 'Error al borrar jefe de turno' });
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Jefe de turno no encontrado' });
      }
      return res.status(200).json({ message: 'Jefe de turno borrado correctamente' });
    });
  }

  if (rol === 'técnico') {
    return borrarTecnico(rut, (err, result) => {
      if (err) return res.status(500).json({ error: 'Error al borrar técnico' });
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Técnico no encontrado' });
      }
      return res.status(200).json({ message: 'Técnico borrado correctamente' });
    });
  }

  return res.status(400).json({ error: 'Rol no válido' });
};

const getSupervisoresIncidentes = (req, res) => {
  readAllSupervisores((err, supervisores) => {
    if (err) {
      console.error('[GET SUPERVISORES]', err.sqlMessage);
      return res.status(500).json({ error: 'Error obteniendo supervisores' });
    }
    if (!supervisores) {
      return res.status(404).json({ error: 'No se ha encontrado ningun supervisor' })
    }

    let completados = 0;

    supervisores.forEach((supervisor, index) => {
      const rut = supervisor.rut;

      readIncidenteSupervisor(rut, (err2, incidentes) => {
        if (err2) {
          return res.status(500).json({ error: 'Error al obtener incidentes de un supervisor' });
        }

        supervisores[index].incidentes = incidentes;
        completados++;

        if (completados === supervisores.length) {
          res.status(200).json(supervisores);
        }
      });
    });
  });
};

module.exports = {
  crearFuncionario, 
  actualizarFuncionario,
  borrarFuncionario,
  getSupervisoresIncidentes
};
