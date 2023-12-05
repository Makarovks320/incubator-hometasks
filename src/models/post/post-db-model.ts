import mongoose, {HydratedDocument, Model} from "mongoose";
import {ObjectId} from "mongodb";
import {NewestLikesType} from "./post-view-model";
import {InputPost} from "../../services/post-service";
import {LIKE_STATUS_DB_ENUM, LIKE_STATUS_ENUM, LikeStatusType} from "../like/like-db-model";
import {CommentDbType, CommentMethodsType} from "../comment/comment-types";
import {convertDbEnumToLikeStatus} from "../../helpers/like-status-converters";

export type PostDBType = {
    _id: ObjectId,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string,
    createdAt: string,
    likesCount: number,
    dislikesCount: number,
    newestLikes: NewestLikesType[]
}

// типизация методов класса (статических)
type PostStaticsType = typeof postStatic;
// типизация методов экземпляра
export type PostMethodsType = typeof postMethods;

// типизация модели со статическими методами
export type PostModelStaticType = Model<PostDBType> & PostStaticsType;

// типизация сущности модели со всеми методами
export type PostModelFullType = Model<PostDBType, {}, PostMethodsType> & PostModelStaticType;

export type PostDocument = HydratedDocument<PostModelFullType>

// краткая информация о лайке
const brieflyLikeSchema = new mongoose.Schema<NewestLikesType>({
    addedAt: {type: String, required: true},
    userId: {type: String, required: true},
    login: {type: String, required: true}
})

const postSchema = new mongoose.Schema<PostDBType, PostModelFullType, PostMethodsType>({
    _id: {type: mongoose.Schema.Types.ObjectId, required: true},
    title: {type: String, required: true},
    shortDescription: {type: String, required: true},
    content: {type: String, required: true},
    blogId: {type: String, required: true},
    blogName: {type: String, required: true},
    createdAt: {type: String, required: true},
    likesCount: {type: Number, required: true},
    dislikesCount: {type: Number, required: true},
    newestLikes: [{type: brieflyLikeSchema, required: true, default: []}]
})

const postStatic: any = {
    createPost(p: InputPost): PostDocument {
        const post: PostDBType = {
            _id: new ObjectId(),
            ...p,
            createdAt: (new Date()).toISOString(),
            likesCount: 0,
            dislikesCount: 0,
            newestLikes: []
        }
        return new PostModel(post);
    }
}

const postMethods = {
    updatePost(postNewData: InputPost, userId: ObjectId) {
        //todo: нужна проверка, что текущий пользователь владеет блогом, к которому относится пост
        const that = this as PostDBType & PostMethodsType;
        that.title = postNewData.title;
        that.shortDescription = postNewData.shortDescription;
        that.content = postNewData.content;
        that.blogId = postNewData.blogId;
        that.blogName = postNewData.blogName;
    },
    recalculateLikesCount(previousLikeType: LIKE_STATUS_DB_ENUM, updateLikeStatus: LikeStatusType) {
        const that = this as PostDBType & PostMethodsType;
        // если нет смысла менять
        if (convertDbEnumToLikeStatus(previousLikeType) === updateLikeStatus) return;

        //уменьшаем количество лайков или дизлайков
        if (previousLikeType === LIKE_STATUS_DB_ENUM.LIKE) that.likesCount--;
        if (previousLikeType === LIKE_STATUS_DB_ENUM.DISLIKE) that.dislikesCount--;
        // увеличиваем количество лайков или дизлайков
        if (updateLikeStatus === LIKE_STATUS_ENUM.LIKE) that.likesCount++;
        if (updateLikeStatus === LIKE_STATUS_ENUM.DISLIKE) that.dislikesCount++;
    },
    insertNewLikeToList(updatedAt: Date, userId: ObjectId, userLogin: string) {
        const that = this as PostDBType & PostMethodsType;
        const newLike: NewestLikesType = {
            addedAt: updatedAt.toISOString(),
            userId: userId.toString(),
            login: userLogin
        }
        that.newestLikes.unshift(newLike);
    }
}

export const PostModel = mongoose.model<PostDBType, PostModelFullType>('posts', postSchema);
