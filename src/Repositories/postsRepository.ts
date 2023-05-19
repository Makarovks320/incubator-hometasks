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
        // todo зачем <post>? По умолчанию внутри коллекции подразумевается какой-то непонятный дефолтный тип
        //  'WithId<Document>[]', у которго нет полей, которые мы огласили в сигнатуре метода, из-за чего ошибка.
        //  Что это за тип  'WithId<Document>[]'?
        // todo зачем .toArray? Чтобы возвращался не cursor-object, возвращаемый методом find, а массив всех
        //  найденных элементов.
    },
    async findPostById(id: string): Promise<post | null> {
        return client.db('ht_05').collection<post>('posts').findOne({id});
    },
    async createNewPost(p: post): Promise<post> {
        await client.db('ht_05').collection('posts').insertOne({...p});
        return p;// todo здесь мы можем получить ошибку из БД? мб стоит возвращать результат из БД?
    },
    async updatePostById(id: string, p: post): Promise<boolean> {
        const result = await client.db('ht_05').collection<post>('posts').updateOne({id}, {"$set":{...p}});
        return result.matchedCount === 1;

    },
    async deleteAllPosts(): Promise<void> {
        await client.db('ht_05').collection('posts').deleteMany({});
    }
}
