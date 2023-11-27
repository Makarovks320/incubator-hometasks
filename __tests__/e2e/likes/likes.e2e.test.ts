import request from 'supertest'
import {HTTP_STATUSES} from "../../../src/enums/http-statuses";
import {app} from "../../../src/app_settings";
import {
    authBasicHeader,
    clearDatabase,
    connectToDataBases,
    disconnectFromDataBases
} from "../../utils/test_utilities";
import {RouterPaths} from "../../../src/helpers/router-paths";
import {CreateUserInputModel} from "../../../src/models/user/create-input-user-model";
import {UserViewModel} from "../../../src/models/user/user-view-model";
import {usersTestManager} from "../../utils/usersTestManager";
import cookie from "cookie";
import {BlogViewModel} from "../../../src/models/blog/blog-view-model";
import {PostViewModel} from "../../../src/models/post/post-view-model";
import {CreatePostInputModel} from "../../../src/models/post/create-post-input-model";
import {CreateBlogInputModel} from "../../../src/models/blog/create-input-blog-model";
import {blogsTestManager} from "../../utils/blogsTestManager";
import {postsTestManager} from "../../utils/postsTestManager";
import {CreateCommentInputModel} from "../../../src/models/comment/create-input-comment-model";
import {commentsTestManager} from "../../utils/commentsTestManager";
import {CommentViewModel} from "../../../src/models/comment/comment-view-model";
import {authTestManager} from "../../utils/authTestManager";

describe('testing likes', () => {
    const email1: string = "email-1@mail.com";
    const email2: string = "email-2@mail.com";
    const email3: string = "email-3@mail.com";
    const password: string = "password123";

    let blog: BlogViewModel | null;
    let post: PostViewModel | null;
    let user: UserViewModel | null = null;
    let user2: UserViewModel | null = null;
    let user3: UserViewModel | null = null;
    let authJWTHeader = {}
    let comment: CommentViewModel | null = null;
    // сюда сохраним токены юзера
    let accessToken: string | null = null;
    let refreshToken: string | null = null;

    beforeAll(connectToDataBases);

    beforeAll(clearDatabase);

    afterAll(disconnectFromDataBases);


    beforeAll(async () => {
        // Создаем блог, к которому будем прикреплять пост
        const blogData: CreateBlogInputModel = {
            "name": "Walter White",
            "description": "Werner Heisenberg: Quantum pioneer, uncertainty principle.",
            "websiteUrl": "https://qwerty.com",
        }

        const {createdBlog} = await blogsTestManager.createBlog(blogData, HTTP_STATUSES.CREATED_201);
        if (!createdBlog) throw new Error('test cannot be performed.');
        blog = createdBlog;

        // Создаем пост, к которому будем прикреплять комменты
        const postData: CreatePostInputModel = {
            "title": "amazing Math_1",
            "shortDescription": "Short description about new amazing Math_1 course",
            "content": "Math_1 Math_1 Math_1 Math_1 Math_1 Math_1",
            "blogId": createdBlog.id,
        }

        const {createdPost} = await postsTestManager.createPost(postData, HTTP_STATUSES.CREATED_201);
        post = createdPost;

        // Создаем юзера 1, чтобы оставлять комменты и лайкать их
        const userData: CreateUserInputModel = {
            "login": "User01",
            "password": password,
            "email": email1,
        }
        // Создаем юзеров 2 и 3, чтобы лайкали
        const userData2: CreateUserInputModel = {
            "login": "User02",
            "password": password,
            "email": email2,
        }
        const userData3: CreateUserInputModel = {
            "login": "User02",
            "password": password,
            "email": email3,
        }

        const {createdUser} = await usersTestManager.createUser(userData, HTTP_STATUSES.CREATED_201, authBasicHeader)
        user = createdUser;
        const {createdUser: createdUser2} = await usersTestManager.createUser(userData, HTTP_STATUSES.CREATED_201, authBasicHeader)
        user2 = createdUser2;
        const {createdUser: createdUser3} = await usersTestManager.createUser(userData, HTTP_STATUSES.CREATED_201, authBasicHeader)
        user3 = createdUser3
    });

    it('Check that necessary support objects have been successfully created', async () => {
        expect(blog).not.toBeNull();
        expect(post).not.toBeNull();
        expect(user).not.toBeNull();
        expect(user2).not.toBeNull();
        expect(user3).not.toBeNull();
    });

    it('should sign in user with correct credentials; status 200; ' +
        'content: JWT access token, JWT refresh token in cookie (http only, secure);', async () => {
        const result: { accessToken: string; refreshToken: string } | null = await authTestManager.loginUser({loginOrEmail: email1, password: password});
        authJWTHeader = {Authorization: `Bearer ${result!.accessToken}`}
    });


    it('should create new comment; status 201; content: created comment;', async () => {
        if (!post) throw new Error('test cannot be performed.');

        const data: CreateCommentInputModel = {content: "Say my name! Heisenberg? You're goddamn right!"}

        const {createdComment} = await commentsTestManager.createComment(post.id, data, HTTP_STATUSES.CREATED_201, authJWTHeader)

        comment = createdComment;

        if (!comment) throw new Error('test cannot be performed.');

        await request(app)
            .get(`${RouterPaths.posts}/${post.id}/comments`)
            .expect(HTTP_STATUSES.OK_200, {
                pagesCount: 1, page: 1, pageSize: 10, totalCount: 1, items: [{
                    id: comment.id,
                    content: data.content,
                    commentatorInfo: comment.commentatorInfo,
                    createdAt: comment.createdAt,
                    likesInfo: {
                        likesCount: 0,
                        dislikesCount: 0,
                        myStatus: "None"
                    }
                }]
            });

        await request(app)
            .get(`${RouterPaths.comments}/${comment.id}`)
            .expect(HTTP_STATUSES.OK_200, {
                id: comment.id,
                content: data.content,
                commentatorInfo: comment.commentatorInfo,
                createdAt: comment.createdAt,
                likesInfo: {
                    likesCount: 0,
                    dislikesCount: 0,
                    myStatus: "None"
                }
            })
    });


    it('should add like for comment', async () => {
        if (!comment) throw new Error('test cannot be performed.');

        const data = {
            likeStatus: "Like"
        }
        await request(app)
            .put(`${RouterPaths.comments}/${comment.id}/like-status`)
            .set(authJWTHeader)
            .send(data)
            .expect(HTTP_STATUSES.NO_CONTENT_204);
    });

})
