import { IPageParams } from './base'

export interface IDemo {
    id: string
    code: string
    name: string
    memo: string
    status: number
    creator?: string
    createdAt?: string
    updatedAt?: string
}

export interface IDemoQueryParam extends IPageParams {
    queryValue?: string
}