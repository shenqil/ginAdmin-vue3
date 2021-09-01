import { IPageParams } from './base'

export interface IRouterResource {
    id: string
    name: string
    memo: string
    method: string
    path: string
    status: number
    creator?: string
    createdAt?: string
    updatedAt?: string
}

export interface IRouterResourceQueryParam extends IPageParams {
    queryValue?: string
    status?: number
}