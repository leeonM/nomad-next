import { Document, Schema, model, models } from "mongoose";
import { IComment } from "./comment.model";

export interface IBlog extends Document {
    _id: string;
    title: string;
    subTitle: string;
    text: string;
    imageUrl?: string;
    creator?: {_id:string, username:string},
}

const BlogSchema = new Schema({
    title: {type: String, required: true},
    subTitle: {type: String, required: true},
    text: {type: String, required: true},
    imageUrl: {type: String},
    creator: { type: Schema.Types.ObjectId, ref: 'User' },

}, {timestamps:true})

const Blog = models.Blog || model('Blog', BlogSchema)

export default Blog;