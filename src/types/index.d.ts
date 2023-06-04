// todo: почему ошибка?
// @ts-ignor

declare global {
    namespace Exress {
        export interface Request {
            context: {
                userId: string | null,
                blogName: string | null
            }
        }
    }
}
