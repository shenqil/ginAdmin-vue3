import { Module, ActionTree, MutationTree, GetterTree } from 'vuex'

export interface IGlobalState {

}

const state: IGlobalState = {

}

const mutations: MutationTree<IGlobalState> = {
}

const actions: ActionTree<IGlobalState, any> = {
}

const getters: GetterTree<IGlobalState, any> = {
}

const stroe: Module<IGlobalState, any> = {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
};

export default stroe