import "reflect-metadata";
import {UsersRepository} from "../repositories/users-repository";
import {JwtService} from "../application/jwt-service";
import {EmailManager} from "../managers/emailManager";
import {EmailAdapter} from "../adapters/email-adapter";
import {AuthService} from "./auth-service";
import {MongoMemoryServer} from "mongodb-memory-server";
import mongoose from "mongoose";
import {UserModel} from "../models/user/user-db-model";
import {ObjectId} from "mongodb";
import {addMinutes} from "date-fns";

//jest.setTimeout(100000000);// для дебаггинга

describe('integration test for AuthService', () => {
    let mongoServer: MongoMemoryServer

    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        const mongoUri = mongoServer.getUri();
        await mongoose.connect(mongoUri);
    })
    afterAll(async () => {
        await mongoose.disconnect();
        await mongoServer.stop();
    })

    const usersRepository = new UsersRepository;
    const jwtService = new JwtService;
    const emailAdapterMock: jest.Mocked<EmailAdapter> = {
        sendEmail: jest.fn(async (email, subject, message) => Promise.resolve(true))
    }

    const emailManager = new EmailManager(emailAdapterMock);

    const authService = new AuthService(usersRepository, jwtService, emailManager);

    describe('create user', () => {

        it('email Adapter Mock should be called', async () => {
            const email = 'email1@mail.com';
            const login = 'login1';
            const result = await authService.createUser(login, email, 'password123');
            if (!result) throw new Error('test can not be performed');

            expect(emailAdapterMock.sendEmail).toBeCalled();
        });

        it('should return correct created user', async () => {
            const email = 'email2@mail.com';
            const login = 'login2';
            const result = await authService.createUser(login, email, 'password123');
            if (!result) throw new Error('test can not be performed');
            expect(result.accountData.email).toBe(email);
            expect(result.accountData.userName).toBe(login);
            expect(result.emailConfirmation.isConfirmed).toBe(false);
        })
    });

    describe('confirm email', () => {
        it('should return false for expired confirmation code', async () => {
            await UserModel.insertMany([
                {
                    _id: new ObjectId(),
                    accountData: {
                        userName: "name 1",
                        email: "email@email.email",
                        salt: "salt",
                        hash: "hash",
                        createdAt: new Date(),
                    },
                    emailConfirmation: {
                        confirmationCode: "some confirmation code",
                        isConfirmed: false,
                        expirationDate: addMinutes(new Date, -1),
                    },
                    passwordRecovery: {
                        passwordRecoveryCode: "",
                        active: false
                    }
                }
            ]);

            const result = await authService.confirmEmailByCodeOrEmail("some confirmation code");

            expect(result).toBeFalsy();
        })

        it('should return false for not existing confirmation code', async () => {

            const result = await authService.confirmEmailByCodeOrEmail("WRONG confirmation code");

            expect(result).toBeFalsy();
        })

        it('should return true for existing and not expired confirmation code', async () => {
            await UserModel.insertMany([
                {
                    _id: new ObjectId(),
                    accountData: {
                        userName: "name 2",
                        email: "email2@email.email",
                        salt: "salt",
                        hash: "hash",
                        createdAt: new Date(),
                    },
                    emailConfirmation: {
                        confirmationCode: "good confirmation code",
                        isConfirmed: false,
                        expirationDate: addMinutes(new Date, 5),
                    },
                    passwordRecovery: {
                        passwordRecoveryCode: "",
                        active: false
                    }
                }
            ]);

            const result = await authService.confirmEmailByCodeOrEmail("good confirmation code");

            expect(result).toBeTruthy();
        })
    })
})