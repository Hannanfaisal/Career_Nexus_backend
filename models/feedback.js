
const mongoose = require("mongoose")

const feedbackSchema = new mongoose.Schema({
    rating: {
        type: Number,
        required: true
    },
  
    description: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User'
    }

},{
    timestamps: true
});

const Feedback = mongoose.model('Feedback', feedbackSchema);
module.exports = Feedback;