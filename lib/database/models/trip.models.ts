import { Document, Schema, model, models } from "mongoose";

export interface ITrip extends Document {
    _id: string;
    title: string;
    description: string;
    tripCity: string;
    tripCountry: string;
    createdAt: Date;
    imageUrl?: string;
    startDate: Date;
    endDate: Date;
    url?: string;
    category: {_id:string, name:string},
    organizer: {_id:string, username:string},
    community?: {_id:string, name:string},
}

const TripSchema = new Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    tripCity: {type: String, required: true},
    tripCountry: {type: String, required: true},
    createdAt: {type: Date, default:Date.now},
    imageUrl: {type: String},
    startDate: {type: Date, default: Date.now},
    endDate: {type: Date, default: Date.now},
    url: {type: String},
    category: { type: Schema.Types.ObjectId, ref: 'Category'},
    organizer: { type: Schema.Types.ObjectId, ref: 'User' },
    community: { type: Schema.Types.ObjectId, ref: 'Community'}
})

const Trip = models.Trip || model('Trip', TripSchema)

export default Trip;