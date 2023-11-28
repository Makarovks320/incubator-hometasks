import {PostsRepository} from "../repositories/posts-repository";
import {PostViewModel} from "../models/post/post-view-model";
import {PostDBModel} from "../models/post/post-db-model";
import {inject, injectable} from "inversify";
import {ObjectId} from "mongodb";
import {stringToObjectIdMapper} from "../helpers/string-to-object-id-mapper";

export type InputPost = {
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string
}

@injectable()
export class PostService {
    constructor(@inject(PostsRepository) private postsRepository: PostsRepository) {}

    async getPostById(id: string): Promise<PostViewModel | null> {
        const objectId = stringToObjectIdMapper(id);
        return this.postsRepository.findPostById(objectId);
    }
    async createNewPost(p: InputPost): Promise<PostDBModel | string> {
        const post: PostDBModel = {
            _id: new ObjectId(),
            ...p,
            createdAt: (new Date()).toISOString()
        }
        return await this.postsRepository.createNewPost(post);
    }
    async updatePostById(id: string, p: InputPost): Promise<boolean> {
        const objectId = stringToObjectIdMapper(id);
        return await this.postsRepository.updatePostById(objectId, p);
    }
    async deleteAllPosts(): Promise<void> {
        await this.postsRepository.deleteAllPosts();
    }
    async deletePostById(id: string): Promise<boolean> {
        const objectId = stringToObjectIdMapper(id);
        return await this.postsRepository.deletePostById(objectId);
    }
}
