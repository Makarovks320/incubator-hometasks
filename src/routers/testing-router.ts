import {NextFunction, Request, Response, Router} from "express";
import {HTTP_STATUSES} from "../enums/http-statuses";
import {RateLimitModel} from "../models/rate-limiting/rate-limiting-model";
import {SessionModel} from "../models/session/session-model";
import {PostModel} from "../models/post/post-db-model";
import {BlogModel} from "../models/blog/blog-db-model";
import {UserModel} from "../models/user/user-db-model";
import {CommentModel} from "../models/comment/comment-db-model";
import {LikeModel} from "../models/like/like-db-model";

export const testingRouter = Router();

testingRouter.delete('/', async (req: Request, res: Response, next: NextFunction) => {
        Promise.all([
            PostModel.deleteMany(),
            BlogModel.deleteMany(),
            UserModel.deleteMany(),
            CommentModel.deleteMany(),
            SessionModel.deleteMany(),
            RateLimitModel.deleteMany({}), // не делал ни сервиса, ни репозитория
            LikeModel.deleteMany({})
        ]).then(() => {
            res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
            return;
        }).catch((e) => {
            console.log(e.message);
            res.sendStatus(HTTP_STATUSES.SERVER_ERROR_500);
            return;
        })
    }
)
