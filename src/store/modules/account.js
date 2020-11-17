export default {
  namespaced: true,

  state: {
    address: null,
    chainId: null,
  },

  mutations: {
    setAddress(state, payload) {
      state.address = payload;
    },
    setChainId(state, payload) {
      state.chainId = payload;
    },
  },
  actions: {
    disconnect({ commit, state }) {
      commit("setAddress", null);
      commit("setChainId", null);
    },
  },
};
