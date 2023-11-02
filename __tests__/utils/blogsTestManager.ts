import {CreateBlogInputModel} from "../../src/models/blog/create-input-blog-model";
import request from "supertest";
import {app} from "../../src/app_settings";
import {authBasicHeader} from "./test_utilities";
import {RouterPaths} from "../../src/helpers/router-paths";
import {HTTP_STATUSES, HttpStatusType} from "../../src/enums/http-statuses";


export  const blogsTestManager ={
    /*
    * метод создания блога с ожидаемым в ответ кодом статуса (например, можно ожидать 201 или 400).
    * Если ожидаем успешное создание, метод выполнит проверку тела ответа.
    * */
    async createBlog(data: CreateBlogInputModel, expectedStatusCode: HttpStatusType) {
        const response = await request(app)
            .post(RouterPaths.blogs)
            .set(authBasicHeader)
            .send(data)
            .expect(expectedStatusCode);

        if(expectedStatusCode === HTTP_STATUSES.CREATED_201) {
            expect(response.body).toEqual({
                createdAt: expect.any(String),
                id: expect.any(String),
                description: data.description,
                isMembership: false,
                name: data.name,
                websiteUrl: data.websiteUrl
            });
        }

        return response;
    }
}
