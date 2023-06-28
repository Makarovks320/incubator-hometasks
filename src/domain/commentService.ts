import {Comment, commentsRepository} from "../Repositories/commentsRepository";
import { User } from "../Repositories/usersRepository";
import { OutputUser, userService } from "./userService";

export type InputComment = {
    content: string
}

export const commentService = {
    async createNewComment(c: InputComment, userId: string): Promise<Comment> {
        // найдем userLogin
        const user: OutputUser | null = await userService.findUserById(userId);
        if (!user) throw new Error('user is not found');

        const comment: Comment = {
            id: new Date().valueOf().toString(),
            content: c.content,
            commentatorInfo: {
                userId: userId,
                userLogin: user.login
            },
            createdAt: (new Date()).toISOString()
        }
        return await commentsRepository.createNewComment(comment);
    },
}
