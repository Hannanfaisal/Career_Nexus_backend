
const { required } = require("joi");
const mongoose = require("mongoose")

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['fullTime', 'partTime', 'freelance', 'internship'],
        required: true
    },

    location: {
        type: String,
        enum: ['onsite', 'remote', 'hybrid'],
        required: true
    },

    level: {
        type: String,
        enum:  ['fresher', 'intermediate', 'expert'],
        required: true
    },

    skills:{
        type: [String],
        required: true
    },
    vacancy:{
        type: Number,
        required: true
    },
    experience:{
        type: Number,
        default: 0
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        default: true
    },
    company: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Company',
        required: true
    },
    applicants: {
        type: [mongoose.SchemaTypes.ObjectId],
        ref: 'User'
    }

},{
    timestamps: true,
});

const Job = mongoose.model('Job', jobSchema);
module.exports = Job;