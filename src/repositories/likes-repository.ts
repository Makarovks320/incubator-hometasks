import {CommentDBModel, CommentModel} from "../models/comment/comment-db-model";
import {MongooseError} from "mongoose";
import {ObjectId} from "mongodb";
import {LikeDbModel, LikeModel, LikeStatusDbEnum} from "../models/like/like-db-model";
import {DEFAULT_MONGOOSE_PROJECTION} from "../db/db";

export class LikesRepository {
    async createNewLike(like: LikeDbModel): Promise<LikeDbModel | string> {
        try {
            await LikeModel.insertMany(like);
        } catch (e) {
            console.log(e);
            if (e instanceof MongooseError) return e.message;
            return 'Mongoose Error';
        }
        return like;
    }

    async getLikesForComment(commentId: ObjectId): Promise<CommentDBModel | null> {
        return CommentModel.findOne({_id})
            .select(DEFAULT_MONGOOSE_PROJECTION)
            .lean();
    }

    async updateLikeStstus(commentId: ObjectId, likeStatus: LikeStatusDbEnum): Promise<boolean> {
        const result = await LikeModel.updateOne({_id: commentId}, likeStatus);
        return result.modifiedCount === 1;
    }

    async deleteAllLikes(): Promise<void> {
        await LikeModel.deleteMany({});
    }
}
