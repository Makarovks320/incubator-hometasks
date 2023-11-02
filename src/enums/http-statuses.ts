export enum HTTP_STATUSES {
    OK_200 = 200,
    CREATED_201 = 201,
    NO_CONTENT_204 = 204,

    BAD_REQUEST_400 = 400,
    NOT_FOUND_404 = 404,
    UNAUTHORIZED_401 = 401,
    FORBIDDEN_403 = 403,
    TOO_MANY_REQUESTS_429 = 429,

    SERVER_ERROR_500 = 500
}
// ключи объекта типа HTTP_STATUSES
type HttpStatusKeys = keyof typeof HTTP_STATUSES

// значения объекта типа HTTP_STATUSES, например, любое число
// или ссылка на значение через путь, например, const b: HttpStatusType = HTTP_STATUSES.OK_200;
export type HttpStatusType = (typeof HTTP_STATUSES)[HttpStatusKeys]

