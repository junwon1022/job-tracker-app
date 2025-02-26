const mongoose = require('mongoose');
const shortid = require('shortid');

// Define the User Schema (Database Structure)
const UserSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: shortid.generate // Generate a shorter unique ID
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Export the model so we can use it in other files
module.exports = mongoose.model('User', UserSchema);
