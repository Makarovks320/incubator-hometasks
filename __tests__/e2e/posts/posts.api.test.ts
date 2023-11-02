import request from "supertest";
import {app} from "../../../src/app_settings";
import {Post} from "../../../src/repositories/posts-repository";
import {RouterPaths} from "../../../src/helpers/router-paths";
import {HTTP_STATUSES} from "../../../src/enums/http-statuses";
import {authBasicHeader} from "../../utils/test_utilities";
import {blogsTestManager} from "../../utils/blogsTestManager";
import {CreateBlogInputModel} from "../../../src/models/blog/create-input-blog-model";
import {BlogViewModel} from "../../../src/models/blog/blog-view-model";

describe('CRUD tests for /posts', () => {
    beforeAll(async () => {
        await request(app).delete(RouterPaths.testing).set(authBasicHeader);
    },);

    it('should return an object with 0 totalCount', async () => {
        await request(app)
            .get('/posts')
            .expect(HTTP_STATUSES.OK_200,{ pagesCount: 0, page: 1, pageSize: 10, totalCount: 0, items: [] });
    });

    it(`shouldn't create post for unexisting blogId`, async () => {
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

    // create blog + create post for blog
    let createdBlogForPost: BlogViewModel | null = null;
    let createdPost: Post | null = null;
    it('should create new post', async () => {
        // сначала создадим блог
        const blogData: CreateBlogInputModel = {
            name: "name test2",
            description: "description test 2",
            websiteUrl: "http://test.ru"
        };
        const {createdBlog} = await blogsTestManager.createBlog(blogData, HTTP_STATUSES.CREATED_201);
        createdBlogForPost = createdBlog;
        if (!createdBlogForPost) {
            throw new Error('test cannot be performed.');
        }
        //создадим пост для createdBlog.id
        const response = await request(app)
            .post('/posts')
            .set(authBasicHeader)
            .send({
                "title": "title 1",
                "content": "content 1",
                "shortDescription": "some short description",
                "blogId": createdBlogForPost.id
            })
            .expect(HTTP_STATUSES.CREATED_201);
        createdPost = response.body;
        expect(createdPost).toEqual({
            createdAt: expect.any(String),
            id: expect.any(String),
            title: "title 1",
            content: "content 1",
            shortDescription: "some short description",
            blogId: createdBlogForPost.id,
            blogName: expect.any(String)
        });
    });

});

//todo проверить GET -> /blogs/:id/posts
//todo проверить GET -> /users
//todo проверить POST -> /users
