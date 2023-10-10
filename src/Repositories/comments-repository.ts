import {commentCollection, DEFAULT_PROJECTION} from "./db";
import {COMMENT_PROJECTION} from "./query-repositories/comment-query-repository";
import {ObjectId} from "mongodb";

export type Comment = CommentOutput & {
    postId: string
}
export type CommentOutput = {
    id: string,
    content: string,
    commentatorInfo: {
        userId: ObjectId,
        userLogin: string
    },
    createdAt: string
}

export const commentsRepository = {
    async createNewComment(comment: Comment): Promise<CommentOutput> {
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

    async updateComment(commentId: string, comment: Comment): Promise<boolean> {
        try {
            const result = await commentCollection.updateOne({id: commentId}, {"$set": {...comment}});
            return result.modifiedCount === 1;
        } catch (e) {
            console.log(e);
            return false;
        }
    },

    async getCommentById(id: string): Promise<CommentOutput | null> {
        return await commentCollection.findOne({id}, {projection: COMMENT_PROJECTION});
    },

    async getCommentByIdWithPostId(id: string): Promise<Comment | null> {
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
