import {PostsRepository} from "../repositories/posts-repository";
import {PostViewModel} from "../models/post/post-view-model";

export type InputPost = {
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string
}

export class PostService {
    constructor(protected postsRepository: PostsRepository) {}

    async getPostById(id: string): Promise<PostViewModel | null> {
        return this.postsRepository.findPostById(id);
    }
    async createNewPost(p: InputPost): Promise<PostViewModel | string> {
        const post = {
            id: new Date().valueOf().toString(),
            ...p,
            createdAt: (new Date()).toISOString()
        }
        return await this.postsRepository.createNewPost(post);
    }
    async updatePostById(id: string, p: InputPost): Promise<boolean> {
        return await this.postsRepository.updatePostById(id, p);
    }
    async deleteAllPosts(): Promise<void> {
        await this.postsRepository.deleteAllPosts();
    }
    async deletePostById(id: string): Promise<boolean> {
        return await this.postsRepository.deletePostById(id);
    }
}
