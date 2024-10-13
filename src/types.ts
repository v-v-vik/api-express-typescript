import {Request} from "express";


export type TypedRequestBody<T> = Request<{}, {}, T>
export type TypedRequestQuery<T> = Request<{}, {}, {}, T>
export type TypedRequestParams<T> = Request<T>
export type TypedRequestParamsBody<T, T2> = Request<T, {}, T2>