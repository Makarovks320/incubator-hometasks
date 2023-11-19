import {LikeStatusDbEnum, LikeStatusType} from "../models/like/like-db-model";

export function convertLikeStatusToDbEnum(likeStatus: LikeStatusType): LikeStatusDbEnum {
    switch (likeStatus) {
        case 'Like':
            return LikeStatusDbEnum.LIKE;
        case 'Dislike':
            return LikeStatusDbEnum.DISLIKE;
        case 'None':
            return LikeStatusDbEnum.NONE;
        default:
            throw new Error('Invalid LikeStatusType');
    }
}

export function convertDbEnumToLikeStatus(dbEnumValue: LikeStatusDbEnum): LikeStatusType {
    switch (dbEnumValue) {
        case LikeStatusDbEnum.LIKE:
            return 'Like';
        case LikeStatusDbEnum.DISLIKE:
            return 'Dislike';
        case LikeStatusDbEnum.NONE:
            return 'None';
        default:
            throw new Error('Invalid LikeStatusDbEnum');
    }
}