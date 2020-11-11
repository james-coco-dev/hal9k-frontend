export default {
  namespaced: true,

  state: {
    started: false,
    timestamp: 0,
  },

  mutations: {
    setStarted(state, payload) {
      state.started = payload;
    },
    setTimeStamp(state, payload) {
      state.timestamp = payload;
    },
  },
};
