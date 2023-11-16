import {emailAdapter} from "../adapters/email-adapter";


export class EmailManager {
    async sendConformationCode(email: string, code: string): Promise<void> {
        const message = ` <h1>Thank for your registration</h1>
            <p>To finish registration please follow the link below:
                <a href=\'https://somesite.com/confirm-email?code=${code}\'>complete registration</a>
            </p>
            Код: ${code}`;
        await emailAdapter.sendEmail(email, 'confirmarion', message)
    }
    async sendNewConformationCode(email: string, code: string): Promise<void> {
        const message = ' <h1>New confirmarion code</h1>\n' +
            ' <p>To finish registration please follow the link below:\n' +
            `     <a href=\'https://somesite.com/confirm-email?code=${code}\'>complete registration</a>\n` +
            ' </p>\n' +
            `Код: ${code}`;
        await emailAdapter.sendEmail(email, 'confirmarion', message)
    }
    async sendPasswordRecoveryMessage(email: string, code: string) {
        const message = `<h1>Password recovery</h1>
        <p>To finish password recovery please follow the link below:
            <a href='https://somesite.com/password-recovery?recoveryCode=${code}'>recovery password</a>
        </p>`
        await emailAdapter.sendEmail(email, "password recovery",message)
    }
}
