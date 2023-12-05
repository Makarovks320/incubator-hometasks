import {ObjectId} from "mongodb";
import {
    LikeDbModel,
    LikeStatusType,
    PARENT_TYPE_ENUM,
} from "../models/like/like-db-model";
import {LikesRepository} from "../repositories/likes-repository";
import {convertLikeStatusToDbEnum, convertParentTypeToDbEnum} from "../helpers/like-status-converters";
import {inject, injectable} from "inversify";
import {LikesQueryRepository} from "../repositories/query-repositories/likes-query-repository";

@injectable()
export class LikeService {
    constructor(
        @inject(LikesRepository) private likesRepository: LikesRepository,
        @inject(LikesQueryRepository) private likesQueryRepository: LikesQueryRepository
    ) {
    }
    async createNewLike(parentId: ObjectId, likeStatus: LikeStatusType, userId: ObjectId): Promise<LikeDbModel> {
        const like: LikeDbModel = {
            _id: new ObjectId(),
            parent_type: convertParentTypeToDbEnum(PARENT_TYPE_ENUM.POST),
            parent_id: parentId,
            type: convertLikeStatusToDbEnum(likeStatus),
            user_id: userId,
            createdAt: new Date(),
            updatedAt: new Date()
        }
        return await this.likesRepository.createNewLike(like);
    }

    async changeLikeStatus(currentLike: LikeDbModel, updateLikeStatus: LikeStatusType): Promise<LikeDbModel> {
        const like: LikeDbModel = {
            ...currentLike,
            parent_type: convertParentTypeToDbEnum(PARENT_TYPE_ENUM.COMMENT),
            type: convertLikeStatusToDbEnum(updateLikeStatus),
            updatedAt: new Date()
        }
        await this.likesRepository.updateLike(like);
        return like;
    }
}

