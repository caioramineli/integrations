const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    description: {
        type: String,
    }
});

const Schedule = mongoose.model('Schedule', scheduleSchema);

module.exports = Schedule;