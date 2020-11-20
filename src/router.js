import Vue from "vue";
import VueRouter from "vue-router";
import Welcome from "@/pages/Home/Welcome";
import Farming from "@/pages/Home/Farming";
import Tokenomics from "@/pages/Home/Tokenomics";
import Event from "@/pages/Event";
import Shop from "@/pages/Shop";
import MyGallery from '@/pages/MyGallery';
import Dropchance from '@/pages/Dropchance';

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
    path: "/shop",
    name: "Shop",
    component: Shop,
  },
  {
    path: "/dropchance",
    name: "Dropchance",
    component: Dropchance,
  },
  {
    path: "/gallery",
    name: "My Gallery",
    component: MyGallery,
  },
];
const router = new VueRouter({
  routes,
  linkActiveClass: "active",
  mode: "history",
});

export default router;
