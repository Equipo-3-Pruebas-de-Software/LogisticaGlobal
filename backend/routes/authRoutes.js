const express = require('express');
const router = express.Router();
const { findUserByCredentials } = require('../models/authModel');
const { crearFuncionario, actualizarFuncionario, borrarFuncionario, getSupervisoresIncidentes, getJefesTurnoIncidentes } = require("../controllers/funcionariosController")

router.post('/login', (req, res) => {
  const { rut, clave } = req.body;

  if (!rut || !clave) {
    return res.status(400).json({ error: 'Faltan datos requeridos' });
  }

  findUserByCredentials(rut, clave, (err, user) => {
    if (err) {
      console.error('[LOGIN ERROR]', err);
      return res.status(500).json({ error: 'Error en el servidor' });
    }

    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    res.json({ success: true, ruta: `/${user.rol}`, usuario: user });
  });
});

router.post("/funcionarios", crearFuncionario);
router.patch("/funcionarios-update", actualizarFuncionario);
router.patch("/funcionarios-delete", borrarFuncionario);
router.get("/supervisores", getSupervisoresIncidentes);
router.get("/jefes-turno", getJefesTurnoIncidentes);

module.exports = router;