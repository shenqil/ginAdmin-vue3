import axios from '../axios/index'


export interface ICaptchaid {
    captcha_id: string
}
/**
 * 获取验证码信息
 * */
export function getCaptchaid(): Promise<ICaptchaid> {
    return axios.get('v1/pub/login/captchaid') as Promise<ICaptchaid>
}