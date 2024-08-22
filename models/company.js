
const { ref } = require("joi");
const mongoose = require("mongoose")

const companySchema = new mongoose.Schema({
    role: {
        type: String,
        default: 'company'
    },
    name: {
        type: String,
        required: true
    },
    photo: {
        type: String,
        default: null
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    phone:{
        type: String,
        default: null
    },
    address:{
        type: String,
        default: null
    },
    jobs: {
        type: [mongoose.SchemaTypes.ObjectId],
        ref: 'Job',
    },
    description: {
        type: String,
        default: null
    }
    

},{
    timestamps: true
});

const Company = mongoose.model('Company', companySchema);
module.exports = Company;