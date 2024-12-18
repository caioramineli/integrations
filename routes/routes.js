const express = require('express');
const router = express.Router();
const nodeSchedule = require('node-schedule')
const axios = require('axios');
const Schedule = require('../models/Schedule');

// console.log(job.nextInvocation());

router.get('/', (req, res) => {
    res.send('Bem-vindo à página inicial!');
});

const verifyApiKey = (req, res, next) => {
    const apiKey = req.headers['auth'];

    if (apiKey && apiKey === process.env.API_KEY) {
        return next();
    }

    return res.status(401).json({ error: 'API Key inválida ou ausente' });
};

router.post('/schedule-event', verifyApiKey, async (req, res) => {
    const {
        description,
        customer,
        payment
    } = req.body;

    const delayInDays = 5;
    const scheduleDate = new Date(Date.now() + delayInDays * 24 * 60 * 60 * 1000);

    // Criando o agendamento no banco com status inicial como 'scheduled'
    const newSchedule = new Schedule({
        description,
        customer,
        payment,
        scheduleDate,
        status: 'AGENDADO'
    });

    await newSchedule.save();

    // Agendando o job para o horário definido
    const job = nodeSchedule.scheduleJob(scheduleDate, async () => {
        try {
            const response = await axios.post(process.env.WEBHOOK_DELETE, {
                description,
                customer,
                payment,
                scheduleDate
            });
            console.log('Requisição enviada com sucesso:', response.data);

            await Schedule.updateOne({ jobId: job.name }, { $set: { status: 'COMPLETO' } });
        } catch (error) {
            console.error('Erro ao enviar a requisição:', error.message);

            await Schedule.updateOne({ jobId: job.name }, { $set: { status: 'FALHOU' } });
        }
    });

    // Associa o jobId ao agendamento recém-criado e salva novamente no banco
    newSchedule.jobId = job.name;
    await newSchedule.save();

    // Respondendo ao cliente que o agendamento foi feito
    res.status(200).json({ msg: `Requisição agendada para ser enviada em ${delayInDays} minutos.` });
});

router.get('/api/protected', verifyApiKey, (req, res) => {
    res.json({ message: 'Acesso concedido! Você acessou um recurso protegido.' });
});

module.exports = router;
