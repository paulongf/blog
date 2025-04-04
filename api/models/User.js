import mongoose from "mongoose";
import { Schema, model } from "mongoose";

const UserSchema = new mongoose.Schema({
    username: {type: String, required: true, min: 4, unique: true},
    password: {type: String, required: true},
    email: {type: String,},
    phone: {type: String},

});

const UserModel = model('User', UserSchema);


export default UserModel;
