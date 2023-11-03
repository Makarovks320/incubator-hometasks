import {ObjectId} from "mongodb";

export type CommentViewModel = {
    id: string,
    content: string,
    commentatorInfo: {
        userId: ObjectId,
        userLogin: string
    },
    createdAt: string
}
