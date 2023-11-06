import {CommentViewModel} from "./comment-view-model";
import {ObjectId} from "mongodb";
import mongoose from "mongoose";

export type CommentDBModel = CommentViewModel & {
    postId: string
}

export const commentMongoSchema = new mongoose.Schema<CommentDBModel>({
    postId: {type: String, required: true},
    id: {type: String, required: true},
    content: {type: String, required: true},
    commentatorInfo: {
        userId: ObjectId,
        userLogin: {type: String, required: true}
    },
    createdAt: {type: String, required: true}
})
