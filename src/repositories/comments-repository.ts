import {DEFAULT_MONGOOSE_PROJECTION} from "../db/db";
import {COMMENT_PROJECTION} from "./query-repositories/comment-query-repository";
import {CommentDBModel, CommentModel} from "../models/comment/comment-db-model";
import {MongooseError} from "mongoose";
import {ObjectId} from "mongodb";

export class CommentsRepository {
    async createNewComment(comment: CommentDBModel): Promise<CommentDBModel | string> {
        try {
            await CommentModel.insertMany(comment);
        } catch (e) {
            console.log(e);
            if (e instanceof MongooseError) return e.message;
            return 'Mongoose Error';
        }
        return comment;
    }

    async updateComment(commentId: ObjectId, comment: CommentDBModel): Promise<boolean> {
            const result = await CommentModel.updateOne({_id: commentId}, comment);
            return result.modifiedCount === 1;
    }

    async getCommentById(_id: ObjectId): Promise<CommentDBModel | null> {
        return CommentModel.findOne({_id})
            .select(COMMENT_PROJECTION)
            .lean();
    }

    async getCommentByIdWithPostId(_id: ObjectId): Promise<CommentDBModel | null> {
        return CommentModel.findOne({_id})
            .select(DEFAULT_MONGOOSE_PROJECTION)
            .lean();
    }

    async deleteCommentById(_id: ObjectId): Promise<boolean> {
        const result = await CommentModel.deleteOne({_id});
        return result.deletedCount === 1;
    }

    async deleteAllBlogs(): Promise<void> {
        await CommentModel.deleteMany({});
    }
}
