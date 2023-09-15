import {UserAccountDBType} from "../Repositories/users-repository";
import jwt from 'jsonwebtoken';

const secret: string = process.env.JWT_SECRET || '';
if (!secret) {
    throw new Error('jwt secret is not passed');
}

export const jwtService = {
    async createToken(user: UserAccountDBType) {
        return jwt.sign({userId: user._id}, secret, {expiresIn: '1h'});
    },
    async getUserIdByToken(token: string): Promise<string | null | undefined> {
        try {
            // делаем в цикле try-catch, т.к. verify() может вернуть ошибку
            const result: any = await jwt.verify(token, secret);
            return result.userId
        } catch (e) {
            return null;
        }
        return
    }
}
