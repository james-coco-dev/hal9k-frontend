// Import Vue
import Vue from "vue";
import VueRouter from "vue-router";
import MainWrapper from "@/pages/MainWrapper";

// Import Vue App, routes, store
import App from "./App";
import routes from "./routes";
import Amplify from "aws-amplify";
import "@aws-amplify/ui-vue";
import "./css/style.scss";
import aws_exports from "./aws-exports";

Amplify.configure(aws_exports);

Vue.component("main-wrapper", MainWrapper);
Vue.use(VueRouter);

// Configure router
const router = new VueRouter({
  routes,
  linkActiveClass: "active",
  mode: "history",
});

new Vue({
  el: "#app",
  render: (h) => h(App),
  router,
});
