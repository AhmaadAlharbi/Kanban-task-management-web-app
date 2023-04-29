import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import BoardDetails from "../views/BoardDetails.vue";
import { useTaskStore } from "../stores/TaskStore"; // import the store instance

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "Home",
      component: HomeView,
    },
    {
      path: "/board/:id",
      name: "BoardDetails",
      component: BoardDetails,
      props: true,
      meta: {
        beforeRouteEnter: (to, from, next) => {
          const taskStore = useTaskStore();
          const id = to.params.id;
          taskStore.fetchBoards().then(() => {
            taskStore.fetchColumns(id).then(() => {
              taskStore.fetchCards(id).then(() => {
                // Fetch subtask for each card
                for (const card of taskStore.cards) {
                  taskStore.fetchSubtasks(card.id);
                }
                next();
              });
            });
          });
        },

        beforeRouteUpdate: (to, from, next) => {
          const taskStore = useTaskStore();
          const id = to.params.id;
          taskStore.fetchBoards().then(() => {
            taskStore.fetchColumns(id).then(() => {
              taskStore.fetchCards(id).then(() => {
                // Fetch subtask for each card
                for (const card of taskStore.cards) {
                  taskStore.fetchSubtasks(card.id);
                }
                next();
              });
            });
          });
        },
      },
    },
  ],
});

export default router;
