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
import {stringToObjectIdMapper} from "../helpers/string-to-object-id-mapper";
import {CommentDBModel} from "../models/comment/comment-db-model";
import {CommentsQueryRepository} from "../repositories/query-repositories/comments-query-repository";
import {LikesQueryRepository} from "../repositories/query-repositories/likes-query-repository";

@injectable()
export class LikeService {
    constructor(
        @inject(LikesRepository) private likesRepository: LikesRepository,
        @inject(LikesQueryRepository) private likesQueryRepository: LikesQueryRepository,
        @inject(CommentsQueryRepository) private commentsQueryRepository: CommentsQueryRepository,
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

    async changeLikeStatus(parentId: string, updateLikeStatus: LikeStatusType, userId: ObjectId): Promise<void> {

        const parentObjectId: ObjectId = stringToObjectIdMapper(parentId);

        // если у текущего пользователя есть лайк для данного коммента, то изменим его, если нет - создадим
        const currentLike: LikeDbModel | null = await this.likesQueryRepository.getLikeForParentForCurrentUser(parentObjectId, userId);
        if (currentLike) {
            const like: LikeDbModel = {
                ...currentLike,
                parent_type: convertParentTypeToDbEnum(PARENT_TYPE_ENUM.COMMENT),
                type: convertLikeStatusToDbEnum(updateLikeStatus),
                updatedAt: new Date()
            }
            await this.likesRepository.updateLike(like);
        } else {
            await this.createNewLike(PARENT_TYPE_DB_ENUM.COMMENT, parentObjectId, userId, updateLikeStatus);
        }

    }
}

