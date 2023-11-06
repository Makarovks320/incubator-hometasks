import {CommentModel, DEFAULT_MONGOOSE_PROJECTION} from "../db/db";
import {COMMENT_PROJECTION} from "./query-repositories/comment-query-repository";
import {CommentDBModel} from "../models/comment/comment-db-model";
import {CommentViewModel} from "../models/comment/comment-view-model";
import {MongooseError} from "mongoose";

export const commentsRepository = {
    async createNewComment(comment: CommentDBModel): Promise<CommentDBModel | string> {
        try {
            await CommentModel.insertMany(comment);
        } catch (e) {
            console.log(e);
            if (e instanceof MongooseError) return e.message;
            return 'Mongoose Error';
        }
        return comment;
    },

    async updateComment(commentId: string, comment: CommentDBModel): Promise<boolean> {
        try {
            const result = await CommentModel.updateOne({id: commentId}, {"$set": {...comment}});
            return result.modifiedCount === 1;
        } catch (e) {
            console.log(e);
            return false;
        }
    },

    async getCommentById(id: string): Promise<CommentViewModel | null> {
        return CommentModel.findOne({id})
            .select(COMMENT_PROJECTION)
            .lean();
    },

    async getCommentByIdWithPostId(id: string): Promise<CommentDBModel | null> {
        return CommentModel.findOne({id})
            .select(DEFAULT_MONGOOSE_PROJECTION)
            .lean();
    },

    async deleteCommentById(id: string): Promise<boolean> {
        const result = await CommentModel.deleteOne({id});
        return result.deletedCount === 1;
    },

    async deleteAllBlogs(): Promise<void> {
        await CommentModel.deleteMany({});
    },
}
