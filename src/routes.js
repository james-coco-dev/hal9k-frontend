import Home from "@/pages/Home";
import Farming from "@/pages/Farming";
import Tokenomics from "@/pages/Tokenomics";

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
];

export default routes;
