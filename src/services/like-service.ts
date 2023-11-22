import {ObjectId} from "mongodb";
import {LikeDbModel, LikeStatusType} from "../models/like/like-db-model";
import {LikesRepository} from "../repositories/likes-repository";
import {convertLikeStatusToDbEnum} from "../helpers/like-status-converters";


export class LikeService {
    constructor(
        private likesRepository: LikesRepository
    ) {
    }

    async createNewLike(commentId: ObjectId, userId: ObjectId, likeStatus: LikeStatusType): Promise<LikeDbModel | string> {
        const like: LikeDbModel = {
            _id: new ObjectId(),
            comment_id: commentId,
            type: convertLikeStatusToDbEnum(likeStatus),
            user_id: userId,
            createdAt: new Date(),
            updatedAt: null
        }
        return await this.likesRepository.createNewLike(like);
    }

    async changeLikeStatus(currentLike: LikeDbModel, updateLikeStatus: LikeStatusType): Promise<boolean> {
        const like: LikeDbModel = {
            ...currentLike,
            type: convertLikeStatusToDbEnum(updateLikeStatus),
            updatedAt: new Date()
        }
        return await this.likesRepository.updateLike(like);
    }
}

