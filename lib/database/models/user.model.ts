import { Schema, model, models } from "mongoose";
import { IComment } from "./comment.model";

export interface IUser extends Document {
    _id: string;
    clerkId: string;
    email: string;
    firstName: string;
    username: string;
    photo: string;
    userLocation: string;
    bio: string;
    likedTrips: string[],
    comments: string[];
    instagram: string;
    tiktok: string;
    linkedin: string;
    github: string;
    facebook: string;
    occupation: string;
    age: string;
    admin: boolean;
}

const UserSchema = new Schema({
    clerkId: {type:String, required:true, unique:true},
    email: {type:String, required:true, unique:true},
    firstName: {type:String, required:true},
    username: {type:String, required:true, unique:true},
    photo: {type:String, required:true},
    userLocation: {type:String},
    bio: {type:String},
    occupation: {type:String},
    instagram: {type:String},
    tiktok: {type:String},
    linkedin: {type:String},
    github: {type:String},
    facebook: {type:String},
    age: {type:String},
    admin: {type:Boolean, default:false},
    likedTrips: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Trip'
        }
    ],
    comments: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ],
})

const User = models.User || model('User', UserSchema)

export default User;
