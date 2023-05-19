import {client} from "../Repositories/db";
import {postsRepository} from "../Repositories/postsRepository";

export type post = {
    id?: string,
    title: string,
    shortDescription?: string,
    content: string,
    blogId?: string,
    blogName?: string,
    createdAt?: string
}

export const postService = {
    async getAllPosts(): Promise<post[]> {
        return postsRepository.getAllPosts();
    },
    async getPostById(id: string): Promise<post | null> {
        return postsRepository.findPostById(id);
    },
    async deleteAllPosts(): Promise<void> {
        await postsRepository.deleteAllPosts();
    },
    async createNewPost(p: post): Promise<post> {
        const post = {
            id: new Date().valueOf().toString(),
            ...p
        }
        return await postsRepository.createNewPost(post);
        // todo здесь мы можем получить ошибку из БД? мб стоит возвращать результат из БД?
    },
    async updatePostById(id: string, p: post): Promise<boolean> {
        return await postsRepository.updatePostById(id, p);
        // todo здесь мы можем получить ошибку из БД? мб стоит возвращать результат из БД?
    },
}
