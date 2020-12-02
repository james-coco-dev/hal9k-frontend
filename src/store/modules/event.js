export default {
  namespaced: true,

  state: {
    started: false,
  },

  mutations: {
    setStarted(state, payload) {
      state.started = payload;
    },
  },
};
