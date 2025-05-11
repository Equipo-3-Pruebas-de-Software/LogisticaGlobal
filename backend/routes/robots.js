const express = require('express');
const router = express.Router();
const { getAllRobots } = require('../controllers/robotsController');
const db = require('../config/db'); // <- Agrega esto para usar la conexión

// Obtener todos los robots (ya existente)
router.get('/', getAllRobots);

// NUEVO: Finalizar reparación y dejar en espera de revisión
router.patch('/finalizar-reparacion', (req, res) => {
  const { id_robot, id_incidente, comentario } = req.body;

  if (!id_robot || !id_incidente || !comentario) {
    return res.status(400).json({ error: 'Faltan datos requeridos' });
  }

  const query1 = `
    UPDATE incidentes
    SET estado = 'Espera revisión', fecha_espera_aprovacion = NOW()
    WHERE id_incidentes = ?
  `;

  const query2 = `
    UPDATE incidentes_robots_tecnicos
    SET descripcion = ?
    WHERE id_robot = ? AND id_incidente = ?
  `;

  db.query(query1, [id_incidente], (err1) => {
    if (err1) {
      console.error("Error al actualizar incidente:", err1);
      return res.status(500).json({ error: 'Error al actualizar estado del incidente' });
    }

    db.query(query2, [comentario, id_robot, id_incidente], (err2) => {
      if (err2) {
        console.error("Error al guardar descripción:", err2);
        return res.status(500).json({ error: 'Error al guardar comentario del técnico' });
      }

      res.json({ success: true, message: 'Incidente actualizado con éxito' });
    });
  });
});

module.exports = router;
