import Vue from "vue";
import VueRouter from "vue-router";
import Home from "@/pages/Home";
import Farming from "@/pages/Farming";
import Event from "@/pages/Event";
import Tokenomics from "@/pages/Tokenomics";
Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/farm",
    name: "Farming",
    component: Farming,
  },
  {
    path: "/tokenomics",
    name: "Tokenomics",
    component: Tokenomics,
  },
  {
    path: "/event",
    name: "Event",
    component: Event,
  },
];
const router = new VueRouter({
  routes,
  linkActiveClass: "active",
  mode: "history",
});

export default router;
