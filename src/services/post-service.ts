import {postsRepository} from "../repositories/posts-repository";
import {PostViewModel} from "../models/post/post-view-model";

export type InputPost = {
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string
}

export const postService = {
    async getPostById(id: string): Promise<PostViewModel | null> {
        return postsRepository.findPostById(id);
    },
    async createNewPost(p: InputPost): Promise<PostViewModel | string> {
        const post = {
            id: new Date().valueOf().toString(),
            ...p,
            createdAt: (new Date()).toISOString()
        }
        return await postsRepository.createNewPost(post);
    },
    async updatePostById(id: string, p: InputPost): Promise<boolean> {
        return await postsRepository.updatePostById(id, p);
    },
    async deleteAllPosts(): Promise<void> {
        await postsRepository.deleteAllPosts();
    },
    async deletePostById(id: string): Promise<boolean> {
        return await postsRepository.deletePostById(id);
    }
}
