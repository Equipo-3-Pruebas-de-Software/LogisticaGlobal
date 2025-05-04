require('dotenv').config();
const express = require('express');
const fs = require('fs');
const path = require('path');
const db = require('./config/db');
const cors = require('cors');

const app = express();

const tecnicosRoutes = require('./routes/tecnicos');
const incidentesRoutes = require('./routes/incidentes');
const incidentesRobotsTecnicosRoutes = require('./routes/incidentesRobotsTecnicos');
const authRoutes = require('./routes/authRoutes');

app.use(express.json());
app.use(cors());

// Ejecutar el script init.sql al iniciar
const initSQL = fs.readFileSync(path.join(__dirname, 'config', 'init.sql'), 'utf8');

db.query(initSQL, (err) => {
  if (err) {
    console.error('❌ Error al ejecutar init.sql:', err.sqlMessage || err);
  } else {
    console.log('✅ Base de datos inicializada correctamente.');
  }
});

// Rutas
app.use('/tecnicos', tecnicosRoutes);
app.use('/incidentes', incidentesRoutes);
app.use('/incidentes-robots-tecnicos', incidentesRobotsTecnicosRoutes);
app.use('/api/auth', authRoutes);

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
