import { Module, ActionTree, MutationTree, GetterTree } from 'vuex'
import { getCacheToken, saveTokenToCache } from '../cache/accessToken'
import { ILoginState, IToken } from '../interface/login'
import router from '../../router'

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
    }
}

const actions: ActionTree<ILoginState, any> = {
    login() {

    },
    loginOut({ commit }) {
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
        if (!state.token || state.token.expiresAt - Date.now() <= 0) {
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