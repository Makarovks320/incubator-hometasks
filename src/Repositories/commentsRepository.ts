import {commentCollection} from "./db";

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

    async deleteAllBlogs(): Promise<void> {
        await commentCollection.deleteMany({});
    },
}
