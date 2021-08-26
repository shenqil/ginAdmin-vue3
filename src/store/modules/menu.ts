import { Module, ActionTree, MutationTree, GetterTree } from 'vuex'
import { IMenuTree } from '../../server/interface'
import menuSrv from '../../server/menu'

export interface IMenuState {
    aside: {
        menuTree: Array<IMenuTree>
        expandedKeys: Array<string>
        selectedKeys: Array<string>
    }
}
const state: IMenuState = {
    aside: {
        menuTree: [],
        expandedKeys: [],
        selectedKeys: []
    }
}

const mutations: MutationTree<IMenuState> = {
    changeAsideMenuTree(state, val: Array<IMenuTree>) {
        state.aside.menuTree = val
    },
    changeAsideExpandedKeys(state, val: Array<string>) {
        state.aside.expandedKeys = val
    },
    changeAsideSelectedKeys(state, val: Array<string>) {
        state.aside.selectedKeys = val
    },
}

const actions: ActionTree<IMenuState, any> = {
    async refreshMenuTree({ commit }) {
        const menuTree = await menuSrv.getTree(undefined)
        commit('changeAsideMenuTree', menuTree)
    }
}

const getters: GetterTree<IMenuState, any> = {
    asideMenuTree(state) {
        return state.aside.menuTree
    },
    asideMenuMap(state): { [index: string]: IMenuTree } {
        const menuMap: { [index: string]: IMenuTree } = {}
        function flattening(trees: Array<IMenuTree>) {
            for (const tree of trees) {
                tree.router && (menuMap[tree.router] = tree)
                tree.id && (menuMap[tree.id] = tree)
                if (Array.isArray(tree.children)) {
                    flattening(tree.children)
                }
            }
        }
        flattening(state.aside.menuTree || {})
        return menuMap
    },
    expandedKeys(state) {
        return state.aside.expandedKeys
    },
    selectedKeys(state) {
        return state.aside.selectedKeys
    },
    selectedKey(state, getters) {
        return getters.selectedKeys[0]
    },
    selectedMenu(state, getters): IMenuTree | undefined {
        const map = getters.asideMenuMap
        const key = getters.selectedKey
        return map[key]
    }
}

const stroe: Module<IMenuState, any> = {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
};

export default stroe