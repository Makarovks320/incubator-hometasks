import request from "supertest";
import {app} from "../../../src/app_settings";
import {Post} from "../../../src/repositories/posts-repository";
import {RouterPaths} from "../../../src/helpers/router-paths";
import {HTTP_STATUSES} from "../../../src/enums/http-statuses";
import {authBasicHeader} from "../../utils/test_utilities";

describe('/posts', () => {
    beforeAll(async () => {
        await request(app).delete('/testing/all-data').set(authBasicHeader);
    }, 10000);
    it('should return an object with 0 totalCount', async () => {
        await request(app)
            .get('/posts')
            .expect(HTTP_STATUSES.OK_200,{ pagesCount: 0, page: 1, pageSize: 10, totalCount: 0, items: [] });
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
            .expect(HTTP_STATUSES.BAD_REQUEST_400,{
                errorsMessages: [ { message: 'blog is not found', field: 'blogId' } ]
            });
    });

    let createdPost: Post | null;
    it('should create new post', async () => {
        // сначала создадим блог
        const {body: createdBlog} = await request(app)
            .post(RouterPaths.blogs)
            .set(authBasicHeader)
            .send({
                name: "name test2 ",
                description: "description test 2",
                websiteUrl: "http://test.ru"
            });
        //создадим пост для createdBlog.id
        const response = await request(app)
            .post('/posts')
            .set(authBasicHeader)
            .send({
                "title": "title 1",
                "content": "content 1",
                "shortDescription": "some short description",
                "blogId": createdBlog.id
            })
            .expect(HTTP_STATUSES.CREATED_201);
        createdPost = response.body;
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
