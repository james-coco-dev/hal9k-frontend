export default {
  namespaced: true,

  state: {
    address: null,
    chainId: null,
    reward: null,
    lastUpdateTime: null,
		nftBalance: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
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
      const { reward, lastUpdateTime, stage } = payload;
      state.reward = reward;
      state.lastUpdateTime = lastUpdateTime;
      state.stage = stage;
    },
		updateBalance(state, payload) {
			const { type, amount } = payload;
			state.nftBalance[type - 1] = amount;
		},
		clearBalance(state, payload) {
			state.nftBalance = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
		},
		setReward(state, payload) {
			state.reward = payload;
		}
  },
  actions: {
    clearAccount({ commit, state }) {
      commit("setAccount", {
        reward: null,
        lastUpdateTime: null,
        stage: null,
      });
    },
		clearBalance({ commit, state }) {
			commit("clearBalance");
		},
		dumpReward({ commit, state }) {
			commit("setReward", 0);
		},
    disconnect({ commit, state }) {
      commit("setAddress", null);
      commit("setChainId", null);
      commit("setAccount", {
        reward: null,
        lastUpdateTime: null,
        stage: null,
      });
    },
  },
};
