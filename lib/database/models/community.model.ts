import { Document, Schema, model, models } from "mongoose";
import { ITrip } from "./trip.model";
import { IUser } from "./user.model";

export interface ICommunity extends Document {
    _id: string;
    name: string;
    bio: string;
    communityLocation: string;
    createdBy: {_id:string, username:string};
    trips: string[];
    members: string[];
    likes: string[];
}

const communitySchema = new Schema({
    name: {type: String, required: true},
    bio: String,
    communityLocation: String,
    createdBy: {
        type: Schema.Types.ObjectId,
        ref:'User'
    },
    trips: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Trip'
        }
    ],
    members: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    likes: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ]
},{timestamps:true})

const Community = models.Community || model('Community', communitySchema)

export default Community;