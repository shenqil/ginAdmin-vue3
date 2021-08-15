import { Module, ActionTree, MutationTree, GetterTree } from 'vuex'
import { IDemoState } from '../interface/demo'


const state: IDemoState = {
    count: 0
}

const mutations: MutationTree<IDemoState> = {
    changeCount(state, val: number) {
        state.count = val
    }
}

const actions: ActionTree<IDemoState, any> = {
    asyncChangeCount({ commit }) {
        setTimeout(() => {
            commit('changeCount', state.count + 1)
        }, 1000)
    }
}

const getters: GetterTree<IDemoState, any> = {
    doubleCount(state) {
        return state.count * 2
    }
}

const stroe: Module<IDemoState, any> = {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
};

export default stroe