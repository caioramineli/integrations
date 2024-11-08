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
            number: { type: Number },
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
        installments: {
            type: Number,
            default: 1
        },
        installmentValue: {
            type: Number
        }
    }
});

const Schedule = mongoose.model('Schedule', scheduleSchema);

module.exports = Schedule;