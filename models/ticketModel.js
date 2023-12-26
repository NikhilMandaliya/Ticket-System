const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    title: { type: String, required: [true, 'Title is required'] },
    description: { type: String, required: [true, 'Description is required'] },
    image: [String],

    remarks: { type: String },
    status: {
        type: String,
        enum: [
            'pending',
            'pending_manager',
            'disapproved_manager',
            'pending_admin',
            'disapproved_admin',
        ],
        default: 'pending',
    },

    employeeRemarks: { type: String },
    managerRemarks: { type: String },
    adminRemarks: { type: String },

    managerApprovalTime: { type: Date },
    adminApprovalTime: { type: Date },

    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Ticket', ticketSchema);
