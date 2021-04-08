import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';

import App from './App.vue';

import './assets/tailwind.css';

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('./views/Home.vue'),
  },
  {
    path: '/app',
    name: 'app',
    component: () => import('./views/TodoApp.vue'),
  },
  {
    path: '/data',
    name: 'data',
    component: () => import('./views/Explorer.vue'),
  },
  {
    path: '/activity',
    name: 'activity',
    component: () => import('./views/Activity.vue'),
  },
  {
    path: '/json',
    name: 'json',
    component: () => import('./views/LedgerJson.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes, // short for `routes: routes`
});

const app = createApp(App);
app.config.devtools = true;
app.use(router);
app.mount('#app');
