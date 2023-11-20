import {ObjectId} from "mongodb";
import mongoose from "mongoose";

export function stringToObjectIdMapper (stringId: string): ObjectId {
    return new mongoose.Types.ObjectId(stringId);
}