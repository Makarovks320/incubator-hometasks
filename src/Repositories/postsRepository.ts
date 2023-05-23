import {postCollection} from "./db";

export type Post = {
    id: string,
    title: string,
    shortDescription?: string,
    content: string,
    blogId: string,
    blogName: string,
    createdAt?: string
}

export const postsRepository = {
    async getAllPosts(): Promise<Post[]> {
        return postCollection.find().toArray();
        // todo зачем <post>? По умолчанию внутри коллекции подразумевается какой-то непонятный дефолтный тип
        //  'WithId<Document>[]', у которго нет полей, которые мы огласили в сигнатуре метода, из-за чего ошибка.
        //  Что это за тип  'WithId<Document>[]'?
        // todo зачем .toArray? Чтобы возвращался не cursor-object, возвращаемый методом find, а массив всех
        //  найденных элементов.
    },
    async findPostById(id: string): Promise<Post | null> {
        return postCollection.findOne({id});
    },
    async createNewPost(p: Post): Promise<Post> {
        await postCollection.insertOne({...p});
        return p;// todo здесь мы можем получить ошибку из БД? мб стоит возвращать результат из БД?
    },
    async updatePostById(id: string, p: Post): Promise<boolean> {
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
