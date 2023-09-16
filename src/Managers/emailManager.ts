import {emailAdapter} from "../adapter/email-adapter";


export const emailManager = {
    async sendConformationCode(email: string) {
        await emailAdapter.sendEmail(email, 'confirmarion', 'link')
    }
}
