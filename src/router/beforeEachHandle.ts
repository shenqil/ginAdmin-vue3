import { RouteLocationNormalized } from 'vue-router'
import store from '../store/index'

/**
 * 检测是否登录
 * */
function checkIsLogin(to: RouteLocationNormalized, from: RouteLocationNormalized) {
    const urlList = ['/login', '404']
    const isLogin = store.getters['login/isLogin']
    if (!isLogin && !urlList.includes(to.path)) {
        return {
            name: 'Login',
            query: {
                redirect: encodeURIComponent(window.location.href),
            },
            replace: true
        }
    }
}

/**
 * 获取当前登录用户信息
 * */
async function getCurrentLoginUserInfo(to: RouteLocationNormalized, from: RouteLocationNormalized) {
    const isLogin = store.getters['login/isLogin']
    const userInfo = store.getters['login/userInfo']

    // 已登录但是用户信息不存在就获取用户信息
    if (isLogin && !userInfo.userName) {
        await store.dispatch('login/fetchLoginUserInfo')
    }
}


export default [
    checkIsLogin,
    getCurrentLoginUserInfo
]