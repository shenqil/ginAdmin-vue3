import { RouteLocationNormalized } from 'vue-router'
import store from '../store/index'

/**
 * 检测是否登录
 * */
function checkIsLogin(to: RouteLocationNormalized, from: RouteLocationNormalized) {
    const isLogin = store.getters['login/isLogin']
    if (!isLogin && to.path !== '/login') {
        store.dispatch('login/loginOut')
        return false
    }
}

export default [
    checkIsLogin
]