import Vue from "vue";
import VueRouter from "vue-router";
import Welcome from "@/pages/Home/Welcome";
import Farming from "@/pages/Home/Farming";
import Tokenomics from "@/pages/Home/Tokenomics";
import Event from "@/pages/Event";
import Gallery from "@/pages/Gallery";
import MyDeck from "@/pages/MyDeck";
import Drop from "@/pages/Drop";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Welcome",
    component: Welcome,
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
  {
    path: "/gallery",
    name: "Gallery",
    component: Gallery,
  },
  {
    path: "/drop",
    name: "Drop",
    component: Drop,
  },
  {
    path: "/deck",
    name: "Deck",
    component: MyDeck,
  },
];
const router = new VueRouter({
  routes,
  linkActiveClass: "active",
  mode: "history",
});

export default router;
