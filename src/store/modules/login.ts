import { Module, ActionTree, MutationTree, GetterTree } from 'vuex'
import { getCacheToken, saveTokenToCache } from '../cache/accessToken'
import { ILoginState, IToken } from '../interface/login'
import router from '../../router'
import { refreshToken, loginOut, IMenuTree, getMenuTree } from '../../server/login'


/**
 * token自动管理
 * */
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

        console.log(lastAccessTime, '时间后刷新token')
        this.refreshTimeout = setTimeout(() => {
            this.refreshTask()
            console.log("token已刷新")
        }, lastAccessTime)
    }

    refreshTask() {
        refreshToken()
    }
}

const tokenManage = new TokenManage()

const state: ILoginState = {
    token: getCacheToken(),
    menuTree: []
}

const mutations: MutationTree<ILoginState> = {
    setToken(state, token: IToken) {
        state.token = {
            ...state.token,
            ...token
        }
        saveTokenToCache(state.token)
        tokenManage.updateRefreshTask(token.expiresAt)
    },
    setMenuTree(state, menuTree: Array<IMenuTree>) {
        state.menuTree = menuTree
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

        // 清空menuTree
        commit('setMenuTree', [])

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
    async fetchMenuTree({ commit }) {
        const { list: menuTree } = await getMenuTree()
        commit('setMenuTree', menuTree)
        return menuTree
    }
}

const getters: GetterTree<ILoginState, any> = {
    isLogin(state) {
        if (!state.token || typeof state.token.expiresAt !== 'number' || state.token.expiresAt * 1000 - Date.now() <= 0) {
            return false
        }

        return true
    },
    menuTree(state) {
        return state.menuTree
    },
    menuMap(state) {
        const menuMap: any = {}
        function flattening(trees: Array<IMenuTree>) {
            for (const tree of trees) {
                menuMap[tree.router] = tree
                if (Array.isArray(tree.children)) {
                    flattening(tree.children)
                }
            }
        }
        flattening(state.menuTree || {})
        return menuMap
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