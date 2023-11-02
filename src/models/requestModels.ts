import {Request} from 'express'

//todo: где использовать их, почему пустые объекты там?
export type RequestsWithParams<T> = Request<T>
export type RequestsWithBody<T> = Request<{},{},T>
export type RequestsWithQuery<T> = Request<{},{},{},T>
export type RequestsWithParamsAndBody<T,B> = Request<T,{},B>
