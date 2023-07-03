import {commentCollection} from "./db";
import {COMMENT_PROJECTION} from "./commentQueryRepository";

export type Comment = CommentOutput & {
    postId: string //todo: добавил в модель комента, чтобы была связь с постом. Правильно?
}
export type CommentOutput = {
    id: string,
    content: string,
    commentatorInfo: {
        userId: string,
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

    async getCommentById(id: string): Promise<CommentOutput | null> {
        return await commentCollection.findOne({id}, {projection: COMMENT_PROJECTION});
    },

    async deleteCommentById(id: string): Promise<boolean> {
        const result = await commentCollection.deleteOne({id});
        return result.deletedCount === 1;
    },

    async deleteAllBlogs(): Promise<void> {
        await commentCollection.deleteMany({});
    },
}
