import mongoose, { Document } from "mongoose";

interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    profilePic?: string;
    birthday?: string;
    phone?: string;
    address?: {
        city?: string;
        street?: string;
        houseNr?: string;
        postcode?: string;
    };
    cv?: string;
    createdAt: Date;
}

// Define the User Schema (Database Structure)
const UserSchema = new mongoose.Schema<IUser>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePic: { type: String, default: "" },
    birthday: {type: String, default: ""},
    phone: {type: String, default: ""},
    address: {
        city: { type: String, default: "" },
        street: { type: String, default: "" },
        houseNr: { type: String, default: "" },
        postcode: { type: String, default: "" }
    },
    cv: {type: String, default: ""},
    createdAt: { type: Date, default: Date.now },
});

// Export the model so we can use it in other files
export default mongoose.model<IUser>("User", UserSchema);
