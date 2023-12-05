import {ObjectId} from "mongodb";
import {LIKE_STATUS_DB_ENUM} from "../like/like-db-model";
import {HydratedDocument, Model} from "mongoose";
import {commentMethods, commentStatics} from "./comment-db-model";

// dto-типы
export type CreateCommentDto = {
    _id: ObjectId,
    content: string,
    postId: string,
    userId: ObjectId,
    userLogin: string
}
export type CommentDbType = {
    _id: ObjectId,
    content: string,
    commentatorInfo: {
        userId: ObjectId,
        userLogin: string
    },
    createdAt: string,
    postId: string,
    dbLikesInfo: dbLikesInfoType
}
export type  dbLikesInfoType = {
    likesCount: number,
    dislikesCount: number,
    likes: likeForComment[] | []
}
export type likeForComment = {
    userId: ObjectId,
    likeStatus: LIKE_STATUS_DB_ENUM
}

// типизация методов класса (статических)
type CommentStaticsType = typeof commentStatics;
// типизация методов экземпляра
export type CommentMethodsType = typeof commentMethods;

// типизация модели со статическими методами
export type CommentModelStaticType = Model<CommentDbType> & CommentStaticsType;

// типизация сущности модели со всеми методами
// todo: узнать в чем отличие от HydratedDocument, ведь и там, и там добавляется куча логики,
//  почему не добавляется сразу еще и _id и __v и др. - в чем смысл в два этапа обогащать типами?
// Пока вижу так: этот тип используется при создании Схемы и Модели
export type CommentModelFullType = Model<CommentDbType, {}, CommentMethodsType> & CommentModelStaticType;
// А этот тип получается после создания модели. Модель по find() будет возвращать уже его.
export type CommentDocument = HydratedDocument<CommentModelFullType>