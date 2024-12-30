const express = require('express');
const router = express.Router();
const nodeSchedule = require('node-schedule');
const axios = require('axios');
const Schedule = require('../models/Schedule');

const verifyApiKey = (req, res, next) => {
    const apiKey = req.headers['auth'];

    if (apiKey && apiKey === process.env.API_KEY) {
        return next();
    }

    return res.status(401).json({ error: 'API Key inválida ou ausente' });
};

router.get('/', (req, res) => {
    res.send('Bem-vindo à página inicial!');
});

// Função para criar e agendar um job
async function createJob(scheduleDate, data, step, schedule) {
    return nodeSchedule.scheduleJob(scheduleDate, async () => {
        try {
            const response = await axios.post(process.env.WEBHOOK_DELETE, {
                ...data,
                step,
            });
            console.log(`[${step}] Requisição enviada com sucesso:`, response.data);

            // Atualiza o status no banco com base no tipo de step
            await Schedule.updateOne(
                { jobId: schedule.jobId },
                { $set: { status: 'COMPLETO', step: step } }
            );
        } catch (error) {
            console.error(`[${stepType}] Erro ao enviar a requisição:`, error.message);

            // Marca o status como FALHOU em caso de erro
            await Schedule.updateOne({ jobId: schedule.jobId }, { $set: { status: 'FALHOU' } });
        }
    });
}

router.post('/schedule-event', verifyApiKey, async (req, res) => {
    const { description, customer, payment, step } = req.body;
    const delayInDays = 5;
    const scheduleDate = new Date(Date.now() + delayInDays * 24 * 60 * 60 * 1000);

    const newSchedule = new Schedule({
        description,
        customer,
        payment,
        scheduleDate,
        step,
        status: 'AGENDADO',
    });

    await newSchedule.save();

    // Agendar para 5 dias
    const jobData = { description, customer, payment, scheduleDate };
    await createJob(scheduleDate, jobData, 'Envio inicial', newSchedule);

    // Agendar para 30 dias
    const deleteScheduleDate = new Date(scheduleDate.getTime() + 25 * 24 * 60 * 60 * 1000);
    await createJob(deleteScheduleDate, jobData, 'Exclusão', newSchedule);

    res.status(200).json({ msg: `Requisição agendada com sucesso para 5 e 30 dias.` });
}
);

module.exports = router;
