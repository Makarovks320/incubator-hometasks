import request from 'supertest'

import {HTTP_STATUSES} from "../../src/enums/http-statuses";
import {app} from "../../src/app_settings";
import {
    authBasicHeader,
    clearDatabase,
    connectToDataBases,
    disconnectFromDataBases
} from "../utils/test_utilities";
import {RouterPaths} from "../../src/helpers/router-paths";
import {UserCreateModel} from "../../src/models/user/create-input-user-model";
import {UserViewModel} from "../../src/models/user/user-view-model";
import {usersTestManager} from "../utils/usersTestManager";
import {usersRepository} from "../../src/repositories/users-repository";
import {UserDBModel} from "../../src/models/user/user-db-model";

describe('testing password recovery', () => {

    beforeAll(connectToDataBases);

    beforeAll(clearDatabase);

    afterAll(disconnectFromDataBases);

    let user: UserViewModel | null;

    beforeAll(async () => {
        //Создаем юзера
        const userData: UserCreateModel = {
            login: "login1",
            password: "password123",
            email: "email123@mail.com",
        }

        const {createdUser} = await usersTestManager.createUser(userData, HTTP_STATUSES.CREATED_201, authBasicHeader)
        user = createdUser;
    });

    it('Check that necessary support objects have been successfully created', async () => {
        expect(user).not.toBeNull();
    })

    it('should send email with code', async () => {
        const data = {
            'email': 'email123@mail.com'
        }

        await request(app)
            .post(`${RouterPaths.auth}/password-recovery`)
            .send(data)
            .expect(HTTP_STATUSES.NO_CONTENT_204)

    });

    it('should return error if password is incorrect; status 400;', async () => {
        if (!user) throw new Error('test cannot be performed.');

        const userDB: UserDBModel | null = await usersRepository.findUserByLoginOrEmail(user.email);

        if (!userDB) throw new Error('test cannot be performed.');

        const data = {
            'newPassword': 'short',
            'recoveryCode': userDB.passwordRecovery.passwordRecoveryCode
        }

        const response = await request(app)
            .post(`${RouterPaths.auth}/new-password`)
            .send(data)
            .expect(HTTP_STATUSES.BAD_REQUEST_400)
        expect(response.body).toEqual({errorsMessages: [
                { message: expect.any(String), field: 'newPassword' }
            ]});
    });

    it('should return status 204 even if such email doesnt exist; status 204;', async() => {

        const data = {
            'email': 'unexistingEmailAddress@jopa.com'
        }

        await request(app)
            .post(`${RouterPaths.auth}/password-recovery`)
            .send(data)
            .expect(HTTP_STATUSES.NO_CONTENT_204)
    });
})
// POST -> "auth/password-recovery": should send email with recovery code; status 204;
// POST -> "auth/new-password": should confirm password recovery; status 204;
// POST -> "auth/password-recovery": should return status 401 if try to login with old password; status 204;
// POST -> "/auth/login": should sign in user with new password; status 200; content: JWT token;
