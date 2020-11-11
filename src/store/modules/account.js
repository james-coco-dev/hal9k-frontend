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
};
