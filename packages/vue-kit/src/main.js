import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import App from './App.vue';
import Home from './views/Home.vue';
import LokiJS from './views/todos/LokiJS.vue';
import ActivityLog from './views/ActivityLog.vue';
import RawLedger from './views/RawLedger.vue';

import './assets/tailwind.css';

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
  },
  {
    path: '/todo-app',
    name: 'todo-app',
    component: LokiJS,
  },
  {
    path: '/activity-log',
    name: 'activity-log',
    component: ActivityLog,
  },
  {
    path: '/raw-ledger',
    name: 'raw-ledger',
    component: RawLedger,
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
