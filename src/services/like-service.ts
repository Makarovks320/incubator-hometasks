import {ObjectId} from "mongodb";
import {
    LikeDbModel,
    LikeStatusType,
    PARENT_TYPE_DB_ENUM,
    PARENT_TYPE_ENUM,
    ParentTypeValues
} from "../models/like/like-db-model";
import {LikesRepository} from "../repositories/likes-repository";
import {convertLikeStatusToDbEnum, convertParentTypeToDbEnum} from "../helpers/like-status-converters";
import {inject, injectable} from "inversify";

@injectable()
export class LikeService {
    constructor(
        @inject(LikesRepository) private likesRepository: LikesRepository
    ) {
    }

    async createNewLike(parentType: PARENT_TYPE_DB_ENUM, parentId: ObjectId, userId: ObjectId, likeStatus: LikeStatusType): Promise<LikeDbModel | string> {
        const like: LikeDbModel = {
            _id: new ObjectId(),
            parent_type: convertParentTypeToDbEnum(PARENT_TYPE_ENUM.COMMENT),
            parent_id: parentId,
            type: convertLikeStatusToDbEnum(likeStatus),
            user_id: userId,
            createdAt: new Date(),
            updatedAt: new Date()
        }
        return await this.likesRepository.createNewLike(like);
    }

    async changeLikeStatus(currentLike: LikeDbModel, updateLikeStatus: LikeStatusType): Promise<boolean> {
        const like: LikeDbModel = {
            ...currentLike,
            parent_type: convertParentTypeToDbEnum(PARENT_TYPE_ENUM.COMMENT),
            type: convertLikeStatusToDbEnum(updateLikeStatus),
            updatedAt: new Date()
        }
        return await this.likesRepository.updateLike(like);
    }
}

