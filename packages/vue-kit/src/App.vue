<template>
  <div class="flex flex-col h-screen">
    <nav class="flex items-center justify-between h-16 bg-gray-700">
      <ul class="flex">
        <li class="ml-2">
          <router-link
            to="/"
            class="bg-gray-100 p-2 rounded"
            active-class="font-bold bg-indigo-100"
          >
            Home
          </router-link>
        </li>
        <li class="ml-2">
          <router-link
            to="/todo-app"
            class="bg-gray-100 p-2 rounded"
            active-class="font-bold bg-indigo-100"
          >
            App
          </router-link>
        </li>
        <!-- <li class="ml-2">
          <router-link
            to="/activity-log"
            class="bg-gray-100 p-2 rounded"
            active-class="font-bold bg-indigo-100"
          >
            Activity Log
          </router-link>
        </li> -->
        <li class="ml-2">
          <router-link
            to="/raw-ledger"
            class="bg-gray-100 p-2 rounded"
            active-class="font-bold bg-indigo-100"
          >
            Raw Ledger
          </router-link>
        </li>
      </ul>
      <div
        v-if="!userLoading"
        class="flex cursor-pointer hover:text-gray-300 text-white"
        @click="generateUser"
      >
        <img
          :src="`https://robohash.org/${user.identity.x}${user.identity.y}`"
          class="inline-block bg-white w-12 h-12 ring-white shadow rounded-full ml-4 border border-gray-400 my-2"
        >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6 my-5 mx-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
          />
        </svg>
      </div>
      <div v-else>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6 my-5 mx-2 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
      </div>
    </nav>

    <router-view
      v-model:ledger="ledger"
      :user="user"
    />
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import { createIdentity } from '@concords/identity';

const defaultUser = {
  "secret": "JRxW6TjcK76B1KLKi7uo5syiKAFkgPWmSb6cmnv95i2cV5mClSv1dYCDD8uuYs3S",
  "identity": {
    "x": "ztE--LL6yBgQOy7Yr6egGZYi4n3OLWX22GsBCYPx-efYNvePZQ6GEYT1SIvaIgZA",
    "y": "RuOLBSMJmD-BK5URkjwP32MoGLRzmyqNUIrdTpBOwnGP2BZepXzMNu9114YvMOoG"
  }
}

export default defineComponent({
  setup() {
    const ledger = ref(JSON.parse(localStorage.getItem('ledger')));
    const user = ref(JSON.parse(localStorage.getItem('user')) || defaultUser);
    const userLoading = ref(false);

    watch(ledger, () => {
      localStorage.setItem('ledger', JSON.stringify(ledger.value));
    })

    async function generateUser() {
      userLoading.value = true;
      user.value = await createIdentity();
      localStorage.setItem('user', JSON.stringify(user.value));
      userLoading.value = false;
    }

    return { ledger, user, generateUser, userLoading }
  },
})
</script>
