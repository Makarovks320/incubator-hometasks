import {ExtendedLikesInfoType, PostViewModel} from "../models/post/post-view-model";
import {PostDBModel} from "../models/post/post-db-model";
import {LIKE_STATUS_ENUM} from "../models/like/like-db-model";

export const getPostViewModel = (postDb: PostDBModel,
                                 extendedLikesInfo: ExtendedLikesInfoType = {
                                     likesCount: 0,
                                     dislikesCount: 0,
                                     myStatus: LIKE_STATUS_ENUM.NONE,
                                     newestLikes: []
                                 }
                                    ): PostViewModel => {
    return {
        id: postDb._id.toString(),
        title: postDb.title,
        shortDescription: postDb.shortDescription,
        content: postDb.content,
        blogId: postDb.blogId,
        blogName: postDb.blogName,
        createdAt: postDb.createdAt,
        extendedLikesInfo
    }
}
