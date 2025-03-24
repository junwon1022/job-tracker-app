import mongoose, { Document, Model } from "mongoose";

interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    isVerified: boolean;
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
    friendCode: string;
    friends: string[];
    friendRequests: string[];
    createdAt: Date;
}

const UserSchema = new mongoose.Schema<IUser>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    profilePic: { type: String, default: "" },
    birthday: { type: String, default: "" },
    phone: { type: String, default: "" },
    address: {
        city: { type: String, default: "" },
        street: { type: String, default: "" },
        houseNr: { type: String, default: "" },
        postcode: { type: String, default: "" }
    },
    cv: { type: String, default: "" },
    friendCode: { type: String, unique: true},
    friends: { type: [String], default: [] },
    friendRequests: { type: [String], default: [] },
    createdAt: { type: Date, default: Date.now },
});

// Use `validate` hook so it's triggered even during `.create()`
UserSchema.pre("validate", async function (next) {
    if (!this.friendCode) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = '';
        let existing;

        do {
            code = Array.from({ length: 6 }, () => characters[Math.floor(Math.random() * characters.length)]).join('');
            existing = await (this.constructor as mongoose.Model<IUser>).findOne({ friendCode: code });
        } while (existing);

        this.friendCode = code;
    }
    next();
});

const UserModel = mongoose.model<IUser>("User", UserSchema);
export default UserModel;
