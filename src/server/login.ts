import axios from '../axios/index'
import { IPageData } from './interface'

/**
 * 获取验证码信息
 * */
export async function getCaptchaid(): Promise<string> {
    const res = await axios.get('/api/v1/pub/login/captchaid') as any

    if (!res || typeof res.captchaId !== 'string') {
        throw new Error("数据返回错误");
    }

    return res.captchaId as string
}

/**
 * 响应图形验证码
 * */
export function getCaptcha(id: string): string {
    return `/api/v1/pub/login/captcha?id=${id}`
}



/**
 * 用户登录
 * */
export interface ILoginParams {
    captchaCode: string,
    captchaId: string,
    password: string,
    userName: string
}
export interface IToken {
    accessToken: string,
    expiresAt: number,
    tokenType: string
}
export async function login(params: ILoginParams): Promise<IToken> {
    return await axios.post('/api/v1/pub/login', params) as IToken
}

/**
 * 刷新令牌
 * */
export function refreshToken(): Promise<IToken> {
    return axios.post('/api​/v1​/pub​/refresh-token')
}

/**
 * 用户登出
 * */
export function loginOut() {
    return axios.post('/api/v1/pub/login/exit')
}

/**
 * 查询当前用户菜单树
 * */
export interface IMenuResource {
    actionId: string,
    id: string
    method: string
    path: string
}

export interface IMenuAction {
    code: string,
    id: string,
    menuId: string,
    name: string
    resources?: Array<IMenuResource>
}
export interface IMenuTree {
    id: string
    icon: string
    name: string
    parentId: string
    parentPath: string
    router: string
    sequence: number
    showStatus: number
    status: number
    actions?: IMenuAction
    children?: IMenuResource
}
export async function getMenuTree(): Promise<IPageData<Array<IMenuTree>>> {
    return await axios.get('/api/v1/pub/current/menutree') as IPageData<Array<IMenuTree>>
}