import { RouteLocationNormalized } from 'vue-router'
import store from '../store/index'

/**
 * 检测是否登录
 * */
function checkIsLogin(to: RouteLocationNormalized, from: RouteLocationNormalized) {
    const isLogin = store.getters['login/isLogin']
    if (!isLogin && to.path !== '/login') {
        return {
            path: '/login',
            query: {
                redirect: encodeURIComponent(window.location.href),
            },
            replace: true
        }
    }
}

/**
 * 数据初始化
 * */
function dataInit(to: RouteLocationNormalized, from: RouteLocationNormalized) {
    const isLogin = store.getters['login/isLogin']
    if (isLogin) {
        store.dispatch('login/fetchMenuTree')
    }
}

export default [
    checkIsLogin,
    dataInit
]