import Vue from "vue";
import Vuex from "vuex";
import VuexPersistence from "vuex-persist";

import account from "./modules/account";
import event from "./modules/event";

Vue.use(Vuex);

const vuexLocal = new VuexPersistence({
  storage: window.localStorage,
  modules: ["account"],
});

export default new Vuex.Store({
  modules: {
    account,
    event,
  },

  state: {
    loading: false,
  },

  mutations: {
    loading(state, loading) {
      state.loading = loading;
    },
  },

  plugins: [vuexLocal.plugin],
});
