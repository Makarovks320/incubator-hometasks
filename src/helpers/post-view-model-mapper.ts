import {ExtendedLikesInfoType, PostViewModel} from "../models/post/post-view-model";
import {PostDBModel} from "../models/post/post-db-model";

export const getPostViewModel = (postDb: PostDBModel,
                                 extendedLikesInfo: ExtendedLikesInfoType = {
                                     likesCount: 0,
                                     dislikesCount: 0,
                                     myStatus: 'None',
                                     newestLikes: null
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
