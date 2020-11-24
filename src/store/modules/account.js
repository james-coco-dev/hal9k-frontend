export default {
  namespaced: true,

  state: {
    address: null,
    chainId: null,
    balance: null,
    lastUpdateTime: null,
    stage: null,
  },

  mutations: {
    setAddress(state, payload) {
      state.address = payload;
    },
    setChainId(state, payload) {
      state.chainId = payload;
    },
    setAccount(state, payload) {
      const { balance, lastUpdateTime, stage } = payload;
      state.balance = balance;
      state.lastUpdateTime = lastUpdateTime;
      state.stage = stage;
    }
  },
  actions: {
    clearAccount({ commit, state }) {
      commit("setAccount", {
        balance: null,
        lastUpdateTime: null,
        stage: null,
      })
    },
    disconnect({ commit, state }) {
      commit("setAddress", null);
      commit("setChainId", null);
      commit("setAccount", {
        balance: null,
        lastUpdateTime: null,
        stage: null,
      })
    },
  },
};
