import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';

import App from './App.vue';

import TodoApp from './views/TodoApp.vue';
import RawLedger from './views/RawLedger.vue';

import './assets/tailwind.css';

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('./views/Home.vue'),
  },
  {
    path: '/todo-app',
    name: 'todo-app',
    component: () => import('./views/TodoApp.vue'),
  },
  {
    path: '/raw-ledger',
    name: 'raw-ledger',
    component: () => import('./views/RawLedger.vue'),
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
