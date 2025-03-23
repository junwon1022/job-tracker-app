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

let UserModel: Model<IUser>;

// Generate Friend Code
const generateFriendCode = async (): Promise<string> => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
  
    while (true) {
      code = Array.from({ length: 6 }, () => characters[Math.floor(Math.random() * characters.length)]).join('');
      const existing = await UserModel.findOne({ friendCode: code });
      if (!existing) break;
    }
  
    return code;
};

// Define the User Schema (Database Structure)
const UserSchema = new mongoose.Schema<IUser>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
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
    friendCode: { type: String, unique: true, required: true },
    friends: {types: [String], default: []},
    friendRequests: { types: [String], default: [] },
    createdAt: { type: Date, default: Date.now },
});

// Pre-save middleware to generate the friend code
UserSchema.pre("save", async function (next) {
    if (!this.friendCode) {
        this.friendCode = await generateFriendCode();
    }
    next(); 
});


UserModel = mongoose.model<IUser>("User", UserSchema);
// Export the model so we can use it in other files
export default UserModel;