import {DEFAULT_PROJECTION, postCollection} from "../db/db";
import {InputPost} from "../services/post-service";
import {PostViewModel} from "../models/post/post-view-model";

export const postsRepository = {
    async findPostById(id: string): Promise<PostViewModel | null> {
        return postCollection.findOne({id}, { projection: DEFAULT_PROJECTION});
    },
    async createNewPost(p: PostViewModel): Promise<PostViewModel> {
        await postCollection.insertOne({...p}); //todo: нужно ли деструктурировать?
        return p;// todo здесь мы можем получить ошибку из БД? мб стоит возвращать результат из БД?
    },
    async updatePostById(id: string, p: InputPost): Promise<boolean> {
        const result = await postCollection.updateOne({id}, {"$set":{...p}});
        return result.matchedCount === 1;

    },
    async deleteAllPosts(): Promise<void> {
        await postCollection.deleteMany({});
    },
    async deletePostById(id: string): Promise<boolean> {
        const result = await postCollection.deleteOne({id});
        return result.deletedCount === 1
    }
}
