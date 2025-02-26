import mongoose, { Document } from "mongoose";

interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    createdAt: Date;
}

// Define the User Schema (Database Structure)
const UserSchema = new mongoose.Schema<IUser>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

// Export the model so we can use it in other files
export default mongoose.model<IUser>("User", UserSchema);
