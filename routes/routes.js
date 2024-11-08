const express = require('express');
const router = express.Router();
const nodeSchedule = require('node-schedule')
const axios = require('axios');
const Schedule = require('../models/Schedule');

// console.log(job.nextInvocation());

router.get('/', (req, res) => {
    res.send('Bem-vindo à página inicial!');
});

router.post('/schedule-event', async (req, res) => {

    const {
        description,
        customer,
        payment
    } = req.body;

    const delayInMinutes = 1;
    const scheduleDate = new Date(Date.now() + delayInMinutes * 60 * 1000);

    const newSchedule = new Schedule({
        description,
        customer,
        payment,
        scheduleDate
    });

    // Agendando o job para o horário definido
    const job = nodeSchedule.scheduleJob(scheduleDate, async () => {
        try {
            // Enviar a requisição para o webhook
            const response = await axios.post(process.env.WEBHOOK_DELETE, {
                description,
                customer,
                payment
            });
            console.log('Requisição enviada com sucesso:', response.data);

            await Schedule.updateOne({ jobId: job.name }, { $set: { status: 'completed' } });
        } catch (error) {
            console.error('Erro ao enviar a requisição:', error.message);

            await Schedule.updateOne({ jobId: job.name }, { $set: { status: 'failed' } });
        }
    });

    newSchedule.jobId = job.name;
    await newSchedule.save();

    // Respondendo ao cliente que o agendamento foi feito
    res.status(200).json({ msg: `Requisição agendada para ser enviada em ${delayInMinutes} minutos.` });
});



module.exports = router;
