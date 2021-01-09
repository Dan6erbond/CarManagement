import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Cars from "../views/Cars.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/cars",
    name: "Cars",
    component: Cars,
  },
  {
    path: "/cars/:make",
    name: "CarsByMake",
    component: Cars,
  },
  {
    path: "/cars/:make/:model",
    name: "Cars",
    component: Cars,
  },
  {
    path: "/rentals",
    name: "Home",
    component: Home,
  },
  {
    path: "/rentals/:id",
    name: "Home",
    component: Home,
  },
  {
    path: "/customers",
    name: "Home",
    component: Home,
  },
  {
    path: "/customers/:id",
    name: "Home",
    component: Home,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
