// Import shortid
const shortid = require('shortid');
import mongoose, { Document } from "mongoose";
import User from "../models/User";

interface IJob extends Document {
    _id: String;
    user: mongoose.Types.ObjectId;
    company: string;
    position: string;
    status: string;
    createdAt: Date;
}

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

export default mongoose.model<IJob>("Job", JobSchema);
