// Import Vue
import Vue from "vue";
import MainWrapper from "@/pages/MainWrapper";

// Import Vue App, routes, store
import App from "./App";
import router from "./router";
import { sync } from "vuex-router-sync";
import store from "./store";
import NavBar from "./Navbar";

//////////////////////////////

Vue.component("main-wrapper", MainWrapper);
Vue.component("nav-bar", NavBar);
// Configure router

sync(store, router);

new Vue({
  el: "#app",
  store,
  router,
  render: (h) => h(App),
});
