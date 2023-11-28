import mongoose from "mongoose";
import {ObjectId} from "mongodb";

export class PostDBModel {
    constructor(
        public _id: ObjectId,
        public title: string,
        public shortDescription: string,
        public content: string,
        public blogId: string,
        public blogName: string,
        public createdAt: string
    ) {
    }
}

const postMongoSchema = new mongoose.Schema<PostDBModel>({
    _id: {type: mongoose.Schema.Types.ObjectId, required: true},
    title: {type: String, required: true},
    shortDescription: {type: String, required: true},
    content: {type: String, required: true},
    blogId: {type: String, required: true},
    blogName: {type: String, required: true},
    createdAt: {type: String, required: true}
})
export const PostModel = mongoose.model('posts', postMongoSchema);
