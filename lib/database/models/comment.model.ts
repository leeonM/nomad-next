import { Document, Schema, model, models } from "mongoose";

export interface IComment extends Document {
    _id: string;
    text: string;
    username: string;
    userId: {_id:string, username:string};
    parentId: {_id:string, title:string};
    createdAt: Date;
}

const commentSchema = new Schema({
    text: {
        type: String, 
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: true,
    }, 
    username: String,
    parentId: {
        type: Schema.Types.ObjectId, 
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
})

const Comment = models.Comment || model('Comment', commentSchema)

export default Comment;