export default {
	namespaced: true,

	state: {
		nftBalance: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		rewardedNft: 0,
	},

	mutations: {
		updateBalance(state, payload) {
			const { type, amount } = payload;
			state.nftBalance[type - 1] = amount;
		},
		clearBalance(state, payload) {
			state.nftBalance = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
		},
		setRewardNft(state, payload) {
			state.rewardedNft = payload;
		}
	},
	actions: {
		clearBalance({ commit, state }) {
			commit("clearBalance");
		},
		dumpReward({ commit, state }) {
			commit("setRewardNft", 0);
		}
	},
};
