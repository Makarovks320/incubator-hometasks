import "reflect-metadata";
import {UsersRepository} from "../repositories/users-repository";
import {JwtService} from "../application/jwt-service";
import {EmailManager} from "../managers/emailManager";
import {EmailAdapter} from "../adapters/email-adapter";
import {AuthService} from "./auth-service";
import {MongoMemoryServer} from "mongodb-memory-server";
import mongoose from "mongoose";

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
        sendEmail: jest.fn(async (email, subject, message)=> Promise.resolve(true))
    }

    const emailManager = new EmailManager(emailAdapterMock);

    const authService = new AuthService(usersRepository, jwtService, emailManager);

    describe('create user', () => {
        it('should return', async () => {
            const email = 'email@mail.com';
            const login = 'login1';
            const result = await authService.createUser(login, email, 'password123');
            if (!result) throw new Error('test can not be performed');
            expect(result.accountData.email).toBe(email);
            expect(result.accountData.userName).toBe(login);
            expect(result.emailConfirmation.isConfirmed).toBe(false);
        })
    })
})