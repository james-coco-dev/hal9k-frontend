export default {
  namespaced: true,

  state: {
    address: null,
  },

  mutations: {
    setAddress(state, payload) {
      state.address = payload;
    },
  },
  actions: {
    disconnect({ commit, state }) {
      commit("setAddress", null);
    },
  },
};
