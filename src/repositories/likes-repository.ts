import {CommentDBModel, CommentModel} from "../models/comment/comment-db-model";
import {MongooseError} from "mongoose";
import {ObjectId} from "mongodb";
import {LikeDbModel, LikeModel, likesCountInfo, LikeStatusDbEnum} from "../models/like/like-db-model";
import {DEFAULT_MONGOOSE_PROJECTION} from "../db/db";

export class LikesRepository {
    async createNewLike(like: LikeDbModel): Promise<LikeDbModel | string> {
        try {
            const result = await LikeModel.insertMany(like);
            console.log(result);
        } catch (e) {
            console.log(e);
            if (e instanceof MongooseError) return e.message;
            return 'Error';
        }
        return like;
    }

    async updateLike(like: LikeDbModel): Promise<boolean> {
        const result = await LikeModel.updateOne({_id: like._id}, like);
        return result.modifiedCount === 1;
    }
}
