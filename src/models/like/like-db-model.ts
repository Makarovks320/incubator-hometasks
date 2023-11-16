// лайки: id, comment_id, type: 'l' | 'd', user_id, createdAt, updatedAt(?), deletedAt(?)
import {ObjectId} from "mongoose";

export type LikeDbModel = {
    _id: ObjectId,
    comment_id: ObjectId,
    type: 'l' | 'd',
    user_id: ObjectId,
    createdAt: null | Date
}
