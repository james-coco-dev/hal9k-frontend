export default {
  namespaced: true,

  state: {
    started: false,
    ongoing: false,
  },

  mutations: {
    setStarted(state, payload) {
      state.started = payload;
    },
    setOngoing(state, payload) {
      state.ongoing = payload;
    },
  },
};
