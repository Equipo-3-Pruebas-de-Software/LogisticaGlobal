const { crearSupervisor, actualizarSupervisor } = require('../models/supervisoresModel');
const { crearJefeTurno, actualizarJefeTurno } = require('../models/jefeTurnoModel');
const { crearTecnico, actualizarTecnico } = require('../models/tecnicosModel');

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
      return res.status(200).json({ message: 'Supervisor actualizado correctamente' });
    });
  }

  if (rol === 'jefe de turno') {
    return actualizarJefeTurno(rut, password, (err, result) => {
      if (err) return res.status(500).json({ error: 'Error al actualizar jefe de turno' });
      return res.status(200).json({ message: 'Jefe de turno actualizado correctamente' });
    });
  }

  if (rol === 'técnico') {
    return actualizarTecnico(rut, password, (err, result) => {
      if (err) return res.status(500).json({ error: 'Error al actualizar técnico' });
      return res.status(200).json({ message: 'Técnico actualizado correctamente' });
    });
  }

  return res.status(400).json({ error: 'Rol no válido' });
};

module.exports = {
  crearFuncionario, 
  actualizarFuncionario
};
