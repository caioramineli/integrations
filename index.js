const express = require('express');
const cors = require('cors');
const rotas = require('./routes/routes');

const app = express();
const PORT = 5050;

app.use(cors());
app.use(express.json());

app.use('/', rotas);

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
