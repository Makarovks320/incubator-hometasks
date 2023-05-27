import request from 'supertest';
import {app} from "../../src";
import {Blog} from "../../src/Repositories/blogsRepository";

describe('/blogs', () => {
    beforeAll(async () => {
        await request(app).delete('/testing/all-data');
    });

    it('should return an empty array', async () => {
         await request(app)
             .get('/blogs')
             .expect(200,[]);
    });

    it('should not return error (websiteUrl)', async () => {
        await request(app)
            .post('/blogs')
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .send({
                name: "name test",
                description: "description test",
                websiteUrl: "wrong"
            })
            .expect(400,{ errorsMessages: [ { message: 'Invalid value', field: 'websiteUrl' } ] });
    });

    let createdBlog: Blog | null = null;
    it('should create new blog', async () => {
        const response = await request(app)
            .post('/blogs')
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
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
            name: "name test",
            description: "description test",
            websiteUrl: "http://test.ru"
        });

        await request(app)
            .get('/blogs')
            .expect(200,[createdBlog]);
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
});
