import {CommentDBModel} from "../models/comment/comment-db-model";
import {CommentViewModel, LikesInfo} from "../models/comment/comment-view-model";
import {PostViewModel} from "../models/post/post-view-model";
import {PostDBModel} from "../models/post/post-db-model";

export const getPostViewModel = (postDb: PostDBModel,
                                    ): PostViewModel => {
    return {
        id: postDb._id.toString(),
        title: postDb.title,
        shortDescription: postDb.shortDescription,
        content: postDb.content,
        blogId: postDb.blogId,
        blogName: postDb.blogName,
        createdAt: postDb.createdAt
    }
}
