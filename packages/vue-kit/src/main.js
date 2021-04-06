import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import App from './App.vue';
import Home from './views/Home.vue';
import LokiJS from './views/todos/LokiJS.vue';

import './assets/tailwind.css';

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
  },
  {
    path: '/lokijs',
    name: 'lokijs',
    component: LokiJS,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes, // short for `routes: routes`
});

const app = createApp(App);
app.use(router);
app.mount('#app');
