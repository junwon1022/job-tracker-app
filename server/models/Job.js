const mongoose = require('mongoose');
// Import shortid
const shortid = require('shortid');

const JobSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: shortid.generate // Generate a shorter unique ID
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    company: {
        type: String,
        required: true
    },
    position: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'interview', 'rejected', 'hired'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Job', JobSchema);
