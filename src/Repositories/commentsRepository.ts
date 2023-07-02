import {commentCollection, DEFAULT_PROJECTION} from "./db";

export type Comment = {
    id: string,
    content: string,
    commentatorInfo: {
        userId: string,
        userLogin: string
    },
    createdAt: string
}

export const commentsRepository = {
    async createNewComment(comment: Comment): Promise<Comment> {
        await commentCollection.insertOne({...comment});
        return comment;
    },

    async getCommentById(id: string): Promise<Comment | null> {
        return await commentCollection.findOne({id}, {projection: DEFAULT_PROJECTION});
    },

    async deleteCommentById(id: string): boolean {
        const result = await commentCollection.deleteOne({id});
        return result.deletedCount === 1;
    },

    async deleteAllBlogs(): Promise<void> {
        await commentCollection.deleteMany({});
    },
}
