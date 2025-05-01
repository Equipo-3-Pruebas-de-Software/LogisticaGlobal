require('dotenv').config();
const express = require('express');
const app = express();
const db = require('./config/db');

const tecnicosRoutes = require('./routes/tecnicos');


app.use(express.json());

app.use('/tecnicos', tecnicosRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
