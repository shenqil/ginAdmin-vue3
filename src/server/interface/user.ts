import { IPageParams, IPageData } from './base'
import { IRole } from './role'

export interface IUserRole {
    userId: string,
    roleId: string
}

export interface IUser {
    id: string,
    userName: string,
    realName: string,
    password?: string,
    phone?: string,
    email?: string,
    status: number,
    creator?: string,
    createdAt?: string,
    userRoles?: Array<IUserRole>
}

export interface IUserQueryParam extends IPageParams {
    queryValue?: string
    userName?: string
    status?: number
}

/**
 * 通过用户获取的角色
 * */
export interface IRoleResultByUser {
    exist: Array<IRole>, // 当前用户下存在的角色
    notExist: IPageData<IRole>  // 当前用户下不存在的角色
}