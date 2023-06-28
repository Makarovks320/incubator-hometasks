import {DEFAULT_PROJECTION, commentCollection} from "./db";
import {InputComment} from "../domain/commentService";

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
}
