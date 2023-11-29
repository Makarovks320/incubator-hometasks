export type CreatePostInputModel = CreatePostByBlogsRouterInputModel & {
    blogId: string
}
export type CreatePostByBlogsRouterInputModel = {
    title: string,
    shortDescription: string,
    content: string
}