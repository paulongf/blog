import mongoose from "mongoose";
import { Schema, model } from "mongoose";

const UserMessageSchema = new mongoose.Schema({
    username: {type: String, required: true, min: 4, unique: true},
    email: {type: String,},
    phone: {type: String},
    message: {type: String}

});

const UserMessageModel = model('UserMessage', UserMessageSchema);


export default UserMessageModel;
