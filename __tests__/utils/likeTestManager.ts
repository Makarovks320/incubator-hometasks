import request from "supertest";
import {HttpStatusType, HTTP_STATUSES} from "../../src/enums/http-statuses";
import {app} from "../../src/app_settings";
import {RouterPaths} from "../../src/helpers/router-paths";
import {AuthLoginInputData} from "../../src/models/auth/auth-model";
import cookie from "cookie";
import {LIKE_STATUS_ENUM, LikeStatusType} from "../../src/models/like/like-db-model";

export const likeTestManager = {
    /*
    добавление/удаление лайка/дизлайка
     */
    async changeLikeStatusForComment(
        comment_id: string,
        authJWTHeader: Object,
        likeStatus: LikeStatusType,
        expectedStatusCode: HttpStatusType = HTTP_STATUSES.NO_CONTENT_204,
    ): Promise<void> {
        await request(app)
            .put(`${RouterPaths.comments}/${comment_id}/like-status`)
            .set(authJWTHeader)
            .send({likeStatus: likeStatus})
            .expect(expectedStatusCode);
    },
    /*
    проверяет единичный коммент на соответствие по количеству лайков, дизлайков и статуса лайка текущего юзера.
    Опционально принимает заголовок авторизации, что позволяет получать статус Лайка от текущего юзера.
     */
    async checkLikeStatusForCommentById(comment_id: string,
                                        likesCount: number,
                                        dislikesCount: number,
                                        myStatus: LikeStatusType = LIKE_STATUS_ENUM.NONE,
                                        authJWTHeader = {}): Promise<void> {
        const response = await request(app)
            .get(`${RouterPaths.comments}/${comment_id}`)
            .set(authJWTHeader)
            .expect(HTTP_STATUSES.OK_200);
        expect(response.body).toEqual(
            {
                id: comment_id,
                content: expect.any(String),
                commentatorInfo: expect.any(Object),
                createdAt: expect.any(String),
                likesInfo: {
                    likesCount: likesCount,
                    dislikesCount: dislikesCount,
                    myStatus: myStatus
                }
            }
        )
    },
    /*
    проверяет коммент на соответствие по количеству лайков, дизлайков и статуса лайка текущего юзера
    в представлении View модели поста с массивом комментов с пагинацией.
    Предназначен для случая, если у поста есть только один коммент.
    Параметры пагинации прописаны хардкодом.
     */
    async checkLikesForCommentByPostId(post_id: string,
                                       likesCount: number,
                                       dislikesCount: number,
                                       myStatus: LikeStatusType = LIKE_STATUS_ENUM.NONE,
                                       authJWTHeader = {}) {
        const response = await request(app)
            .get(`${RouterPaths.posts}/${post_id}/comments`)
            .set(authJWTHeader)
            .expect(HTTP_STATUSES.OK_200);
        expect(response.body).toEqual({
            pagesCount: 1, page: 1, pageSize: 10, totalCount: 1, items: [{
                id: expect.any(String),
                content: expect.any(String),
                commentatorInfo: expect.any(Object),
                createdAt: expect.any(String),
                likesInfo: {
                    likesCount: likesCount,
                    dislikesCount: dislikesCount,
                    myStatus: myStatus
                }
            }]
        })
    }
}
