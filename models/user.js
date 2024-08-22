const { required } = require("joi");
const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        default: null
    },
    password:{
        type: String,
        required: true
    },
    photo: {
        type: String,
        default: null
    },
    address: {
        type: String,
        default: null
    },
    link: {
        type: [ String ], 
      
    },
    description: {
        type: String,
        default: null
    },
    experience: {
        type: [
            {
                title: {
                    type: String,
                    required: true
                },
                company:{
                    type: String,
                    required: true
                },
                location:{
                    type: String,
                    require: true
                },
                startDate: {
                    type: Date,
                    required: true
                },
                endDate: {
                    type: Date,
                    default: null
                },
    
            }
        ]

    },

    education: {
        type: [
            {
                title: {
                    type: String,
                    required: true
                },
                institute:{
                    type: String,
                    required: true
                },
                startDate: {
                    type: Date,
                    required: true
                },
                endDate: {
                    type: Date,
                    default: null
                },
    
            }
        ]

    },
   skills: {
    type: [ String ]
   },

   languages: {
    type: [String]
   }
   }

,{
    timestamps: true
});

const User = mongoose.model('User', userSchema)
module.exports = User