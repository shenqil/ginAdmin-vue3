import axios, { AxiosRequestConfig } from 'axios'
import { useStore } from 'vuex'
import moment from 'moment';
import { compose } from '../utils/common'
import { IToken } from '../store/interface/login'


const instance = axios.create({
    baseURL: '/api/',
    timeout: 0,
    headers: { 'X-Custom-Header': 'foobar' }
});
const store = useStore()

let refreshTimeout: any;
let lastAccessTime = 0;

export enum contentType {
    from = 'application/x-www-form-urlencoded',
    json = 'application/json'
}

export enum headerKeys {
    ContentType = 'Content-Type',
    Authorization = 'Authorization'
}

export enum methods {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    DELETE = 'DELETE',
    PATCH = 'PATCH',
    HEAD = 'HEAD',
    OPTIONS = 'OPTIONS',
}

/**
 * 获取访问令牌
 * */
function getToken(): IToken {
    return store.state['login/token'] as IToken
}

/**
 * 设置令牌
 * */
function setToken(token: IToken) {

}

/**
 * 退出登录
 * */
function loginOut() {
    if (refreshTimeout) {
        clearTimeout(refreshTimeout);
    }
    store.dispatch('login/loginOut')
}

/**
 * header增加token
 * */
function addTokenToHeader(c: AxiosRequestConfig): AxiosRequestConfig {
    const token = getToken()

    // 判断token过期直接退出
    if (token && token.expiresAt - moment().unix() <= 0) {
        loginOut()
        throw new Error('The token has expired')
    }
    c.headers[headerKeys.Authorization] = `${token.tokenType} ${token.accessToken}`
    return c
}

/**
 * 请求拦截器
 * */
axios.interceptors.request.use(
    function (config) {
        return compose(addTokenToHeader)(config)
    },
    function (error) {
        return Promise.reject(error)
    }
)

/**
 * 响应拦截器
 * */
axios.interceptors.response.use(
    function (response) {
        return response
    },
    function (error) {
        console.log(error)
        return Promise.reject(error)
    }
)

export default instance