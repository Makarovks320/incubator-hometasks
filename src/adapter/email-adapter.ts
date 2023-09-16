import nodemailer from "nodemailer";


export const emailAdapter = {
    async sendEmail(email: string, subject: string, message: string) {
        const transport = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_ADDRESS,
                pass: process.env.EMAIL_APP_PASS
            }
        });
        const info = await transport.sendMail({
            from: `INCUBATOR APP 👻 <${process.env.EMAIL_ADDRESS}>`,
            to: email,
            subject: subject,
            html: message
        });
        return info;
    }
}
