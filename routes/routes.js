const express = require('express');
const router = express.Router();
const nodeSchedule = require('node-schedule')
const axios = require('axios');
const Schedule = require('../models/Schedule');

// console.log(job.nextInvocation());

router.get('/', (req, res) => {
    res.send('Bem-vindo à página inicial!');
});

router.post('/schedule-event', (req, res) => {

    const { message } = req.body;

    const delayInMinutes = 1;
    const data = new Date(Date.now() + delayInMinutes * 60 * 1000);

    // Agendando o job para o horário definido
    const job = nodeSchedule.scheduleJob(data, async () => {
        try {
            const response = await axios.post(process.env.WEBHOOK_DELETE, {
                message: message,
                job: job
            });
            console.log('Requisição enviada com sucesso:', response.data);
        } catch (error) {
            console.error('Erro ao enviar a requisição:', error.message);
        }
    });

    // Respondendo ao cliente que o agendamento foi feito
    res.status(200).json({ msg: `Requisição agendada para ser enviada em ${delayInMinutes} minutos.` });
});

router.post('/schedule', async (req, res) => {
    try {
        const { title, date, description } = req.body;

        const newSchedule = new Schedule({
            title,
            date,
            description,
        });

        const savedSchedule = await newSchedule.save();
        res.status(201).json({ message: 'Agendamento criado com sucesso!', schedule: savedSchedule });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar agendamento', details: error.message });
    }
});


module.exports = router;
