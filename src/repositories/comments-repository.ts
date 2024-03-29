import {DEFAULT_MONGOOSE_PROJECTION, WITHOUT_v_MONGOOSE_PROJECTION} from "../db/db";
import {CommentModel} from "../models/comment/comment-db-model";
import {MongooseError} from "mongoose";
import {ObjectId} from "mongodb";
import {injectable} from "inversify";
import {CommentDbType, CommentDocument} from "../models/comment/comment-types";

@injectable()
export class CommentsRepository {
    async createNewComment(comment: CommentDbType): Promise<CommentDbType | string> {
        try {
            await CommentModel.insertMany(comment);
        } catch (e) {
            console.log(e);
            if (e instanceof MongooseError) return e.message;
            return 'Mongoose Error';
        }
        return comment;
    }

    async updateComment(commentId: ObjectId, comment: CommentDbType): Promise<boolean> {
            const result = await CommentModel.updateOne({_id: commentId}, comment);
            return result.modifiedCount === 1;
    }

    async getCommentByIdWithPostId(_id: ObjectId): Promise<CommentDbType | null> {
        return CommentModel.findOne({_id})
            .select(DEFAULT_MONGOOSE_PROJECTION)
            .lean();
    }

    async findCommentById(_id: ObjectId | string): Promise<CommentDocument | null> {
        return CommentModel.findOne({_id})
            .select(WITHOUT_v_MONGOOSE_PROJECTION);
    }
    async deleteCommentById(_id: ObjectId): Promise<boolean> {
        const result = await CommentModel.deleteOne({_id});
        return result.deletedCount === 1;
    }

    async deleteAllBlogs(): Promise<void> {
        await CommentModel.deleteMany({});
    }

    async save(comment: CommentDocument) {
        await comment.save();
    }
}
