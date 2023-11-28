import {LikeDbModel, LikeModel} from "../models/like/like-db-model";
import {injectable} from "inversify";

@injectable()
export class LikesRepository {
    async createNewLike(like: LikeDbModel): Promise<LikeDbModel> {
        await LikeModel.insertMany(like);
        return like;
    }

    async updateLike(like: LikeDbModel): Promise<boolean> {
        const result = await LikeModel.updateOne({_id: like._id}, like);
        return result.modifiedCount === 1;
    }
}
