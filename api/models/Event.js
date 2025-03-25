import mongoose from "mongoose";
import { Schema, model } from "mongoose";

const EventSchema = new Schema({
    title: String,
    summary: String,
    description: String,
    date: Date,
    location: String,
    cover: String,
    organizer: { type: Schema.Types.ObjectId, ref: 'User' },
}, {
    timestamps: true,
});

const EventModel = model('Event', EventSchema);

export default EventModel;
