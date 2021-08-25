
import { IToken } from '../../server/interface'
const KEY = 'accessToken'

/**
 * 获取缓存里面访问令牌
 * */
export function getCacheToken(): IToken {
    const tokenStr = localStorage.getItem(KEY)
    if (tokenStr) {
        return JSON.parse(tokenStr)
    }
    return {
        accessToken: '',
        tokenType: '',
        expiresAt: 0
    }
}

/**
 * 保存令牌到缓存
 * */
export function saveTokenToCache(token: IToken) {
    localStorage.setItem(KEY, JSON.stringify(token))
}