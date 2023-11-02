import request from "supertest";
import {app} from "../../src/app_settings";
import {authBasicHeader} from "./test_utilities";
import {RouterPaths} from "../../src/helpers/router-paths";
import {HTTP_STATUSES, HttpStatusType} from "../../src/enums/http-statuses";
import * as supertest from "supertest";
import {CreatePostInputModel} from "../../src/models/post/create-post-input-model";
import {PostViewModel} from "../../src/models/post/post-view-model";


export const postsTestManager = {
    /*
    * метод создания поста с ожидаемым в ответ кодом статуса (например, можно ожидать 201 или 400).
    * Если ожидаем успешное создание, метод выполнит проверку тела ответа.
    * */
    async createPost(data: CreatePostInputModel, expectedStatusCode: HttpStatusType)
        : Promise<{ response: supertest.Response; createdPost: PostViewModel | null }> {
        const response: request.Response = await request(app)
            .post(RouterPaths.posts)
            .set(authBasicHeader)
            .send(data)
            .expect(expectedStatusCode);
        let createdPost: PostViewModel | null = null;

        if (expectedStatusCode === HTTP_STATUSES.CREATED_201) {
            createdPost = response.body;

            if (!createdPost) {
                throw new Error('test cannot be performed.');
            }

            expect(createdPost).toEqual({
                createdAt: expect.any(String),
                id: expect.any(String),
                title: data.title,
                content: data.content,
                shortDescription: data.shortDescription,
                blogId: createdPost.blogId,
                blogName: expect.any(String)
            });
        }

        return {response, createdPost: createdPost};
    }
}
