// Import shortid
const shortid = require('shortid');
import mongoose, { Document } from "mongoose";

interface IJob extends Document {
    _id: string;
    company: string;
    position: string;
    status: string;
    createdAt: Date;
    applicants: [string];
}

const JobSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: shortid.generate
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
    },
    applicants: [{
        type: [String],
        ref: 'User'
    }]
});

export default mongoose.model<IJob>("Job", JobSchema);
