import {Post, postsRepository} from "../Repositories/posts-repository";

export type InputPost = {
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string
}

export const postService = {
    async getPostById(id: string): Promise<Post | null> {
        return postsRepository.findPostById(id);
    },
    async createNewPost(p: InputPost): Promise<Post> {
        const post = {
            id: new Date().valueOf().toString(),
            ...p,
            createdAt: (new Date()).toISOString()
        }
        return await postsRepository.createNewPost(post);
        // todo здесь мы можем получить ошибку из БД? мб стоит возвращать результат из БД?
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
