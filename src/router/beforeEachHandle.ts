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


export default [
    checkIsLogin
]