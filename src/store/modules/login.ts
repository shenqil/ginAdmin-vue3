import { Module, ActionTree, MutationTree, GetterTree } from 'vuex'
import { getCacheToken, saveTokenToCache } from '../cache/accessToken'
import { ILoginState, IToken } from '../interface/login'
import router from '../../router'
import { refreshToken, loginOut } from '../../server/login'

class TokenManage {

    refreshTimeout: any;
    advanceTime = 10 * 1000 // 提前10秒刷新token

    /**
     * 更新token刷新任务
     * */
    updateRefreshTask(expiresAt: number) {

        const lastAccessTime = expiresAt * 1000 - this.advanceTime - Date.now()
        if (lastAccessTime <= 0) {
            return
        }

        if (this.refreshTimeout) {
            clearTimeout(this.refreshTimeout)
        }

        this.refreshTimeout = setTimeout(() => {
            this.refreshTask()
        }, lastAccessTime)
    }

    refreshTask() {
        refreshToken()
    }
}

const tokenManage = new TokenManage()

const state: ILoginState = {
    token: getCacheToken()
}

const mutations: MutationTree<ILoginState> = {
    setToken(state, token: IToken) {
        state.token = {
            ...state.token,
            ...token
        }
        saveTokenToCache(state.token)
        tokenManage.updateRefreshTask(token.expiresAt)
    }
}

const actions: ActionTree<ILoginState, any> = {
    loginOut({ commit }) {
        loginOut()
        // 清空token
        commit('setToken', {
            accessToken: '',
            tokenType: '',
            expiresAt: 0
        })

        // 重定向到登录页 
        if (window.location.pathname !== '/login') {
            router.replace({
                path: '/login',
                query: {
                    redirect: encodeURIComponent(window.location.href),
                }
            });
        }
    },

}

const getters: GetterTree<ILoginState, any> = {
    isLogin(state) {
        if (!state.token || state.token.expiresAt * 1000 - Date.now() <= 0) {
            return false
        }

        return true
    }
}

const stroe: Module<ILoginState, any> = {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
};

export default stroe