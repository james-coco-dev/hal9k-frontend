export default {
  namespaced: true,

  state: {
    hal9k: null,
    hal9kLtd: null,
    hal9kNftPool: null,
    hal9kVault: null,
    hal9kv1Router: null,
  },

  mutations: {
    setContracts(state, payload) {
      const {
        hal9k,
        hal9kLtd,
        hal9kNftPool,
        hal9kVault,
        hal9kv1Router,
      } = payload;
      state.hal9k = hal9k;
      state.hal9kLtd = hal9kLtd;
      state.hal9kNftPool = hal9kNftPool;
      state.hal9kVault = hal9kVault;
      state.hal9kv1Router = hal9kv1Router;
    },
    changeFromAddress(state, payload) {
      state.hal9k.options.from = payload;
      state.hal9kLtd.options.from = payload;
      state.hal9kNftPool.options.from = payload;
      state.hal9kVault.options.from = payload;
      state.hal9kv1Router.options.from = payload;
    },
    clearContracts(state) {
      state.hal9k = null;
      state.hal9kLtd = null;
      state.hal9kNftPool = null;
      state.hal9kVault = null;
      state.hal9kv1Router = null;
    },
  },
};
