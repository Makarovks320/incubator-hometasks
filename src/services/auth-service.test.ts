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
import {randomUUID} from "crypto";

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
        const email1 = 'email1@mail.com';
        const login1 = 'login1';
        const email2 = 'email2@mail.com';
        const login2 = 'login2';

        it('email Adapter Mock should be called', async () => {
            const result = await authService.createUser(login1, email1, 'password123');
            if (!result) throw new Error('test can not be performed');

            expect(emailAdapterMock.sendEmail).toBeCalled();
        });

        it('should return correct created user', async () => {
            const result = await authService.createUser(login2, email2, 'password123');
            if (!result) throw new Error('test can not be performed');
            expect(result.accountData.email).toBe(email2);
            expect(result.accountData.userName).toBe(login2);
            expect(result.emailConfirmation.isConfirmed).toBe(false);
        })
    });

    describe('confirm email', () => {
        const emailUser1 = 'email1@mail.com';
        const loginUser1 = 'login1';
        const confirmationCode1 = 'code1';
        const emailUser2 = 'email2@mail.com';
        const loginUser2 = 'login2';
        const confirmationCode2 = 'code2';

        function createUserToInsertToDB (loginUser: string, emailUser: string, confirmationCode: string, expirationDate: Date) {
            return {
                _id: new ObjectId(),
                accountData: {
                    userName: loginUser,
                    email: emailUser,
                    salt: randomUUID(),
                    hash: randomUUID(),
                    createdAt: new Date(),
                },
                emailConfirmation: {
                    confirmationCode: confirmationCode,
                    isConfirmed: false,
                    expirationDate: expirationDate,
                },
                passwordRecovery: {
                    passwordRecoveryCode: "",
                    active: false
                }
            }
        }

        it('should return false for expired confirmation code', async () => {
            await UserModel.insertMany([
                createUserToInsertToDB(loginUser1, emailUser1, confirmationCode1, addMinutes(new Date, -1))
            ]);

            const result = await authService.confirmEmailByCodeOrEmail(confirmationCode1);

            expect(result).toBeFalsy();
        })

        it('should return false for not existing confirmation code', async () => {
            // начинаем следить за функцией с помощью обертки-шпиона:
            const spy = jest.spyOn(usersRepository, 'confirmUserById');
            const result = await authService.confirmEmailByCodeOrEmail(confirmationCode1 + "WRONG");

            expect(result).toBeFalsy();
            expect(spy).not.toBeCalled();
        })

        it('should return true for existing and not expired confirmation code', async () => {
            await UserModel.insertMany([
                createUserToInsertToDB(loginUser2, emailUser2, confirmationCode2, addMinutes(new Date, 1))
            ]);

            const result = await authService.confirmEmailByCodeOrEmail(confirmationCode2);

            expect(result).toBeTruthy();
        })
    })
})