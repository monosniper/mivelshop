import mongoose, {Schema} from "mongoose";

const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    isAdmin: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: new Date(),
    },
});

const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;