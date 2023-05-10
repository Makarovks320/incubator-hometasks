import {client} from "./db";

export type post = {
    id?: string,
    title: string,
    shortDescription?: string,
    content: string,
    blogId?: string,
    blogName?: string,
    createdAt?: string
}

export const postsRepository = {
    async getAllPosts(): Promise<post[]> {
        return client.db('ht_05').collection<post>('posts').find().toArray();
    },
    async findPostById(id: string): Promise<post | null> {
        return client.db('ht_05').collection<post>('posts').findOne({id});
    },
    async deleteAllPosts(): Promise<void> {
        await client.db('ht_05').collection('posts').deleteMany({});
    },
    async createNewPost(p: post): Promise<post> {
        await client.db('ht_05').collection('posts').insertOne({...p});
        return p;// todo здесь мы можем получить ошибку из БД? мб стоит возвращать результат из БД?
    }
}
