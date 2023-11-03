import {commentCollection, DEFAULT_PROJECTION} from "../db/db";
import {COMMENT_PROJECTION} from "./query-repositories/comment-query-repository";
import {CommentDBModel} from "../models/comment/comment-db-model";
import {CommentViewModel} from "../models/comment/comment-view-model";

export const commentsRepository = {
    async createNewComment(comment: CommentDBModel): Promise<CommentViewModel> {
        try {
            await commentCollection.insertOne({...comment});
        } catch (e) {
            console.log(e);
        }
        return { //todo: приходится копировать, чтобы не возвращать postId. Это норм?
            id: comment.id,
            content: comment.content,
            commentatorInfo: comment.commentatorInfo,
            createdAt: comment.createdAt
        };
    },

    async updateComment(commentId: string, comment: CommentDBModel): Promise<boolean> {
        try {
            const result = await commentCollection.updateOne({id: commentId}, {"$set": {...comment}});
            return result.modifiedCount === 1;
        } catch (e) {
            console.log(e);
            return false;
        }
    },

    async getCommentById(id: string): Promise<CommentViewModel | null> {
        return await commentCollection.findOne({id}, {projection: COMMENT_PROJECTION});
    },

    async getCommentByIdWithPostId(id: string): Promise<CommentDBModel | null> {
        return await commentCollection.findOne({id}, {projection: DEFAULT_PROJECTION});
    },

    async deleteCommentById(id: string): Promise<boolean> {
        const result = await commentCollection.deleteOne({id});
        return result.deletedCount === 1;
    },

    async deleteAllBlogs(): Promise<void> {
        await commentCollection.deleteMany({});
    },
}
