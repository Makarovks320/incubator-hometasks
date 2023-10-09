import request from 'supertest';
import {app} from "../../src";
import {Blog} from "../../src/Repositories/blogs-repository";
import mongoose from "mongoose";
import {authBasicHeader, connection_string} from "../utils/test_utilities";
import {STATUSES_HTTP} from "../../src/enums/http-statuses";

describe('/blogs', () => {
    beforeAll(async () => {
        await mongoose.connect(connection_string);
    })

    afterAll(async () => {
        await mongoose.disconnect();
    })
    it('Delete all data before testing', async () => {
        await request(app)
            .delete('/testing/all-data')
            .set(authBasicHeader)
            .expect(STATUSES_HTTP.NO_CONTENT_204)
    })

    it('should return an object with 0 totalCount', async () => {
         await request(app)
             .get('/blogs')
             .expect(200,{ pagesCount: 0, page: 1, pageSize: 10, totalCount: 0, items: [] });
    });

    it('should return error (websiteUrl)', async () => {
        await request(app)
            .post('/blogs')
            .set(authBasicHeader)
            .send({
                name: "name test",
                description: "description test",
                websiteUrl: "wrong"
            })
            .expect(400,{
                errorsMessages: [ { message: 'websiteUrl should be url', field: 'websiteUrl' } ]
            });
    });

    let createdBlog: Blog | null = null;
    it('should create new blog', async () => {
        const response = await request(app)
            .post('/blogs')
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
            .get('/blogs')
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
            .get('/blogs/' + createdBlog?.id)
            .expect(200,createdBlog);
    });

    it('should return 404', async () => {
        await request(app)
            .get('/blogs/' + 'wrong-id-number')
            .expect(404);
    });

    it('should return 204', async () => {
        await request(app)
            .put('/blogs/' + createdBlog?.id, )
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
            .get('/blogs/' + createdBlog?.id);

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
            .get('/blogs')
            .expect(200,{
                pagesCount: 1,
                page: 1,
                pageSize: 10,
                totalCount: 1,
                items: [editedBlog]
            });
    });
});
describe('/posts', () => {
    beforeAll(async () => {
        await request(app).delete('/testing/all-data').set(authBasicHeader);
    }, 10000);
    it('should return an object with 0 totalCount', async () => {
        await request(app)
            .get('/posts')
            .expect(200,{ pagesCount: 0, page: 1, pageSize: 10, totalCount: 0, items: [] });
    });

    it('should return error (blogId)', async () => {
        await request(app)
            .post('/posts')
            .set(authBasicHeader)
            .send({
                "title": "title 1",
                "content": "content 1",
                "shortDescription": "some short description",
                "blogId": "wrong blog id"
            })
            .expect(400,{
                errorsMessages: [ { message: 'blog is not found', field: 'blogId' } ]
            });
    });

    it('should create new post', async () => {
        // сначала создадим блог
        const {body: createdBlog} = await request(app)
            .post('/blogs')
            .set(authBasicHeader)
            .send({
                name: "name test2 ",
                description: "description test 2",
                websiteUrl: "http://test.ru"
            });
        //создадим пост для createdBlog.id
        const {body: createdPost} = await request(app)
            .post('/posts')
            .set(authBasicHeader)
            .send({
                "title": "title 1",
                "content": "content 1",
                "shortDescription": "some short description",
                "blogId": createdBlog.id
            })
            .expect(201);
        expect(createdPost).toEqual({
            createdAt: expect.any(String),
            id: expect.any(String),
            title: "title 1",
            content: "content 1",
            shortDescription: "some short description",
            blogId: createdBlog?.id,
            blogName: expect.any(String)
        });
    });

});

    //todo проверить GET -> /blogs/:id/posts
    //todo проверить GET -> /users
    //todo проверить POST -> /users
