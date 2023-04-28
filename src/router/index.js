import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import BoardDetails from "../views/BoardDetails.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/board/:id",
      name: "BoardDetails",
      component: BoardDetails,
      props: true,
    },
  ],
});

export default router;
