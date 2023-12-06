import {ExtendedLikesInfoType, PostViewModel} from "../models/post/post-view-model";
import {PostDBType} from "../models/post/post-db-model";
import {LIKE_STATUS_ENUM} from "../models/like/like-db-model";

export const getPostViewModel = (postDb: PostDBType, myStatus: LIKE_STATUS_ENUM | null,
                                    ): PostViewModel => {
    return {
        id: postDb._id.toString(),
        title: postDb.title,
        shortDescription: postDb.shortDescription,
        content: postDb.content,
        blogId: postDb.blogId,
        blogName: postDb.blogName,
        createdAt: postDb.createdAt,
        extendedLikesInfo: {
            likesCount: postDb.likesCount,
            dislikesCount: postDb.dislikesCount,
            myStatus: myStatus || LIKE_STATUS_ENUM.NONE,
            newestLikes: postDb.newestLikes.map(l => {
                return {
                    addedAt: l.addedAt,
                    userId: l.userId,
                    login: l.login
                }
            })
        }
    }
}
