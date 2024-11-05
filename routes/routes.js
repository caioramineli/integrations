const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('Bem-vindo à página inicial!');
});

router.get('/sobre', (req, res) => {
    res.send('Esta é a página Sobre.');
});

router.get('/contato', (req, res) => {
    res.send('Esta é a página de contato.');
});

module.exports = router;
