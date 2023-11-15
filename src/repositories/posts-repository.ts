import {DEFAULT_PROJECTION} from "../db/db";
import {InputPost} from "../services/post-service";
import {MongooseError} from "mongoose";
import {PostDBModel, PostModel} from "../models/post/post-db-model";

export class PostsRepository {
    async findPostById(id: string): Promise<PostDBModel | null> {
        return PostModel.findOne({id}, { projection: DEFAULT_PROJECTION});
    }
    async createNewPost(p: PostDBModel): Promise<PostDBModel | string> {
        try {
            await PostModel.insertMany(p);
            return p;
        } catch (e) {
            console.log(e);
            if (e instanceof MongooseError) return e.message;
            return 'Mongoose Error';
        }
    }
    async updatePostById(id: string, post: InputPost): Promise<boolean> {
        const result = await PostModel.updateOne({id}, post);
        return result.matchedCount === 1;

    }
    async deleteAllPosts(): Promise<void> {
        await PostModel.deleteMany({});
    }
    async deletePostById(id: string): Promise<boolean> {
        const result = await PostModel.deleteOne({id});
        return result.deletedCount === 1
    }
}
