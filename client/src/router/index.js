import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Cars from "../views/Cars.vue";
import Car from "../views/Car.vue";

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
    name: "Car",
    component: Car,
  },
  {
    path: "/rentals",
    name: "Rentals",
    component: Home,
  },
  {
    path: "/rentals/:id",
    name: "Rental",
    component: Home,
  },
  {
    path: "/customers",
    name: "Customers",
    component: Home,
  },
  {
    path: "/customers/:id",
    name: "Customer",
    component: Home,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
