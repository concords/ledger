<template>
  <div>
    <nav class="flex items-center justify-between h-16">
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
            to="/lokijs"
            class="bg-gray-100 p-2 rounded"
            active-class="font-bold bg-indigo-100"
          >
            LokiJS
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
    </nav>

    <router-view
      v-model:ledger="ledger"
      :user="user"
    />
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue'

const user = {
  "secret": "JRxW6TjcK76B1KLKi7uo5syiKAFkgPWmSb6cmnv95i2cV5mClSv1dYCDD8uuYs3S",
  "identity": {
    "x": "ztE--LL6yBgQOy7Yr6egGZYi4n3OLWX22GsBCYPx-efYNvePZQ6GEYT1SIvaIgZA",
    "y": "RuOLBSMJmD-BK5URkjwP32MoGLRzmyqNUIrdTpBOwnGP2BZepXzMNu9114YvMOoG"
  }
}

export default defineComponent({
  setup() {
    const ledger = ref(JSON.parse(localStorage.getItem('ledger')));

    return { ledger, user }
  },
})
</script>
