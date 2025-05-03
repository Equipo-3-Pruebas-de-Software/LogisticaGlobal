require('dotenv').config();
const express = require('express');
const app = express();
const db = require('./config/db');

const tecnicosRoutes = require('./routes/tecnicos');
const incidentesRoutes = require('./routes/incidentes');
const incidentesRobotsTecnicosRoutes = require('./routes/incidentesRobotsTecnicos');

app.use(express.json());

app.use('/tecnicos', tecnicosRoutes);
app.use('/incidentes', incidentesRoutes);
app.use('/incidentes-robots-tecnicos', incidentesRobotsTecnicosRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});