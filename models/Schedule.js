const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
    description: {
        type: String
    },
    jobId: {
        type: String
    },
    scheduleDate: {
        type: Date
    },
    status: {
        type: String
    },
    customer: {
        id: {
            type: String
        },
        name: {
            type: String
        },
        email: {
            type: String
        },
        mobileNumber: {
            type: String
        },
        cpfOrCnpj: {
            type: String
        },
        address: {
            street: { type: String },
            number: { type: String },
            city: { type: String },
            state: { type: String },
            zipCode: { type: String }
        }
    },
    payment: {
        cod: {
            type: String,
            required: true
        },
        method: {
            type: String,
            required: true
        },
        value: {
            type: Number,
            required: true
        },
        overdueDate: {
            type: Date,
            required: true
        },
        installment: {
            type: String,
            default: 1
        }
    },
    step: {
        type: String
    }
});

const Schedule = mongoose.model('Schedule', scheduleSchema);

module.exports = Schedule;