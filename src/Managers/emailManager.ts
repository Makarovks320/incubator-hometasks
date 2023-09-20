import {emailAdapter} from "../adapter/email-adapter";


export const emailManager = {
    async sendConformationCode(email: string, code: string): Promise<void> {
        const message = ' <h1>Thank for your registration</h1>\n' +
            ' <p>To finish registration please follow the link below:\n' +
            `     <a href=\'https://somesite.com/confirm-email?code=${code}\'>complete registration</a>\n` +
            ' </p>\n' +
            `Код: ${code}`;
        await emailAdapter.sendEmail(email, 'confirmarion', message)
    },
    async sendNewConformationCode(email: string, code: string): Promise<void> {
        const message = ' <h1>New confirmarion code</h1>\n' +
            ' <p>To finish registration please follow the link below:\n' +
            `     <a href=\'https://somesite.com/confirm-email?code=${code}\'>complete registration</a>\n` +
            ' </p>\n' +
            `Код: ${code}`;
        await emailAdapter.sendEmail(email, 'confirmarion', message)
    }
}
