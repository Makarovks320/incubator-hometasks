import {ObjectId} from "mongodb";
import mongoose from "mongoose";

export type CommentDBModel = {
    _id: ObjectId,
    content: string,
    commentatorInfo: {
        userId: ObjectId,
        userLogin: string
    },
    createdAt: string,
    postId: string
}

const commentMongoSchema = new mongoose.Schema<CommentDBModel>({
    _id: {type: mongoose.Schema.Types.ObjectId, required: true},
    content: {type: String, required: true},
    commentatorInfo: {
        userId: ObjectId,
        userLogin: {type: String, required: true}
    },
    createdAt: {type: String, required: true},
    postId: {type: String, required: true}
})
export const CommentModel = mongoose.model('comments', commentMongoSchema);
