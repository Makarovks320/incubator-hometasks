import mongoose from "mongoose";
import {ObjectId} from "mongodb";

export class LikeDbModel {
    constructor(
        public _id: ObjectId,
        public comment_id: ObjectId,
        public type: LikeStatusDbEnum,
        public user_id: ObjectId,
        public createdAt: null | Date
    ) {
    }
}
export type LikeStatusType = 'Like' | 'Dislike' | 'None';
export enum LikeStatusDbEnum  {
    LIKE,
    DISLIKE,
    NONE
}
const LikeMongoSchema = new mongoose.Schema<LikeDbModel>(
    {
        _id: {type: mongoose.Schema.Types.ObjectId, required: true},
        comment_id: {type: mongoose.Schema.Types.ObjectId, required: true},
        type: {type: String, enum: [LikeStatusDbEnum.LIKE, LikeStatusDbEnum.DISLIKE, LikeStatusDbEnum.NONE], required: true},
        user_id: {type: mongoose.Schema.Types.ObjectId, required: true},
        createdAt: {type: Date, required: true}
    }
)
export const LikeModel = new mongoose.Model('likes', LikeMongoSchema);
