import axios from '../axios/index'


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
export interface ILoginResult {
    accessToken: string,
    expiresAt: number,
    tokenType: string
}
export async function login(params: ILoginParams): Promise<ILoginResult> {
    return await axios.post('/api/v1/pub/login', params) as ILoginResult
}