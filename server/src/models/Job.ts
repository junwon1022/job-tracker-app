// Import shortid
const shortid = require('shortid');
import mongoose, { Document } from "mongoose";

interface IJob extends Document {
    _id: string;
    company: string;
    position: string;
    location: string;
    jobType: 'Full-time' | 'Part-time' | 'Remote' | 'Contract';
    description: string;
    createdAt: Date;
    applicants: string[];
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
    location: {
      type: String,
      required: false
    },
    jobType: {
      type: String,
      enum: ['Full-time', 'Part-time', 'Remote', 'Contract'],
      required: false
    },
    description: {
      type: String,
      required: false
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    applicants: [{
      type: String,
      ref: 'User'
    }]
  });
  

export default mongoose.model<IJob>("Job", JobSchema);
