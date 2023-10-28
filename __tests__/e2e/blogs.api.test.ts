import request from 'supertest';
import {app} from "../../src/app_settings";
import {Blog} from "../../src/repositories/blogs-repository";
import {RouterPaths} from "../../src/helpers/router-paths";
import {authBasicHeader} from "../utils/test_utilities";

describe(RouterPaths.blogs, () => {
    beforeAll(async () => {
        await request(app).delete(RouterPaths.testing).set(authBasicHeader);
    }, 10000);

    it('should return an object with 0 totalCount', async () => {
         await request(app)
             .get(RouterPaths.blogs)
             .expect(200,{ pagesCount: 0, page: 1, pageSize: 10, totalCount: 0, items: [] });
    });

    it('should return error (websiteUrl)', async () => {
        const response = await request(app)
            .post(RouterPaths.blogs)
            .set(authBasicHeader)
            .send({
                name: "name test",
                description: "description test",
                websiteUrl: "wrong"
            })
            .expect(400);
        expect(response.body).toEqual({errorsMessages: [
            { message: expect.any(String), field: 'websiteUrl' }
            ]});
    });

    let createdBlog: Blog | null = null;
    it('should create new blog', async () => {
        const response = await request(app)
            .post(RouterPaths.blogs)
            .set(authBasicHeader)
            .send({
                name: "name test",
                description: "description test",
                websiteUrl: "http://test.ru"
            })
            .expect(201);
        createdBlog = response.body;
        expect(createdBlog).toEqual({
            createdAt: expect.any(String),
            id: expect.any(String),
            description: "description test",
            isMembership: false,
            name: "name test",
            websiteUrl: "http://test.ru"
        });

        await request(app)
            .get(RouterPaths.blogs)
            .expect(200,{
                pagesCount: 1,
                page: 1,
                pageSize: 10,
                totalCount: 1,
                items: [createdBlog]
            });
    });

    it('should return correct blog by id', async () => {
        await request(app)
            .get(`${RouterPaths.blogs}/${createdBlog?.id}`)
            .expect(200,createdBlog);
    });

    it('should return 404', async () => {
        await request(app)
            .get(`${RouterPaths.blogs}/wrong-id-number`)
            .expect(404);
    });

    it('should return 204', async () => {
        await request(app)
            .put(`${RouterPaths.blogs}/${createdBlog?.id}`, )
            .set(authBasicHeader)
            .send({
                name: "edited name",
                description: "description test",
                websiteUrl: "http://test.ru"
            })
            .expect(204);
    });

    it('should return edited blog', async () => {
        const response = await request(app)
            .get(`${RouterPaths.blogs}/${createdBlog?.id}`);

        let editedBlog: Blog | null = response.body;
        expect(editedBlog).toEqual({
            createdAt: expect.any(String),
            id: expect.any(String),
            description: "description test",
            isMembership: false,
            name: "edited name",
            websiteUrl: "http://test.ru"
        });

        await request(app)
            .get(RouterPaths.blogs)
            .expect(200,{
                pagesCount: 1,
                page: 1,
                pageSize: 10,
                totalCount: 1,
                items: [editedBlog]
            });
    });
});


    //todo проверить GET -> /blogs/:id/posts
    //todo проверить GET -> /users
    //todo проверить POST -> /users
