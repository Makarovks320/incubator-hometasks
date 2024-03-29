import {InputPost} from "../services/post-service";
import {MongooseError} from "mongoose";
import {PostDBType, PostDocument, PostModel} from "../models/post/post-db-model";
import {injectable} from "inversify";
import {ObjectId} from "mongodb";

@injectable()
export class PostsRepository {
    async findPostById(_id: ObjectId | string): Promise<PostDocument | null> {
        return PostModel.findOne({_id});
    }
    async createNewPost(p: PostDBType): Promise<PostDBType | string> {
        try {
            await PostModel.insertMany(p);
            return p;
        } catch (e) {
            console.log(e);
            if (e instanceof MongooseError) return e.message;
            return 'Mongoose Error';
        }
    }
    async updatePostById(_id: ObjectId, post: InputPost): Promise<boolean> {
        const result = await PostModel.updateOne({_id}, post);
        return result.matchedCount === 1;

    }
    async deleteAllPosts(): Promise<void> {
        await PostModel.deleteMany({});
    }
    async deletePostById(_id: ObjectId): Promise<boolean> {
        const result = await PostModel.deleteOne({_id});
        return result.deletedCount === 1
    }
    async save(post: PostDocument) {
        await post.save();
    }
}
