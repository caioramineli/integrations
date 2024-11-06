require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rotas = require('./routes/routes');
const { initializeDatabase } = require('./config/dbConn')

const app = express();
const PORT = 5050;

app.use(cors());
app.use(express.json());

initializeDatabase();

app.use('/', rotas);

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
