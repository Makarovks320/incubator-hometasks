import mongoose from "mongoose";
import {ObjectId} from "mongodb";

export class LikeDbModel {
    constructor(
        public _id: ObjectId,
        public comment_id: ObjectId,
        public type: LikeStatusDbEnum,
        public user_id: ObjectId,
        public createdAt: Date,
        public updatedAt: null | Date
    ) {
    }
}
export type LikeStatusType = 'Like' | 'Dislike' | 'None';
export enum LikeStatusDbEnum  {
    LIKE,
    DISLIKE,
    NONE
};
export type likesCountInfo = { likes: number, dislikes: number };

const LikeMongoSchema = new mongoose.Schema<LikeDbModel>(
    {
        _id: {type: mongoose.Schema.Types.ObjectId, required: true},
        comment_id: {type: mongoose.Schema.Types.ObjectId, required: true},
        type: {type: Number, enum: [LikeStatusDbEnum.LIKE, LikeStatusDbEnum.DISLIKE, LikeStatusDbEnum.NONE], required: true},
        user_id: {type: mongoose.Schema.Types.ObjectId, required: true},
        createdAt: {type: Date, required: true},
        updatedAt: {type: Date, required: false}//todo: почему нельзя null при required? Это же определенное значение. Тупой монгус
    }
)
export const LikeModel = mongoose.model('likes', LikeMongoSchema);
