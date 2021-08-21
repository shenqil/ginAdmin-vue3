import { IRole } from './role'

/**
 * 登录参数
 * */
export interface ILoginParams {
    captchaCode: string,
    captchaId: string,
    password: string,
    userName: string
}

/**
 * token结构
 * */
export interface IToken {
    accessToken: string,
    expiresAt: number,
    tokenType: string
}

/**
 * 登录用户信息
 * */
export interface ILoginUserInfo {
    realName: string,
    roles: Array<IRole>,
    userId: string,
    userName: string
}