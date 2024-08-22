const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
    applicantId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User',
        required: true
    },
    jobId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Job',
        required: true
    },
    companyId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Company',
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    interview: {
        type: Boolean, 
        default: false
    }
}, {
    timestamps: true
});

const Application = mongoose.model('Application', applicationSchema);
module.exports = Application;
