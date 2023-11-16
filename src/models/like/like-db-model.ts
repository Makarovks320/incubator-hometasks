import mongoose, {ObjectId} from "mongoose";

export class LikeDbModel {
    constructor(
        public _id: ObjectId,
        public comment_id: ObjectId,
        public type: 'l' | 'd',
        public user_id: ObjectId,
        public createdAt: null | Date
    ) {
    }
}
export enum likeStatus  {
    Like,
    Dislike
}
const LikeMongoSchema = new mongoose.Schema<LikeDbModel>(
    {
        _id: {type: mongoose.Schema.Types.ObjectId, required: true},
        comment_id: {type: mongoose.Schema.Types.ObjectId, required: true},
        type: {type: String, enum: [likeStatus.Like, likeStatus.Dislike], required: true},
        user_id: {type: mongoose.Schema.Types.ObjectId, required: true},
        createdAt: {type: Date, required: true}
    }
)
export const LikeModel = new mongoose.Model('likes', LikeMongoSchema);
