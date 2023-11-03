import {CommentViewModel} from "./comment-view-model";

export type CommentDBModel = CommentViewModel & {
    postId: string
}
