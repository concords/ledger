<template>
  <div>
    <loki
      :user="user"
      :ledger="ledger"
    />
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue'
import Loki from './components/Loki.vue';

const user = {
  "secret": "JRxW6TjcK76B1KLKi7uo5syiKAFkgPWmSb6cmnv95i2cV5mClSv1dYCDD8uuYs3S",
  "identity": {
    "x": "ztE--LL6yBgQOy7Yr6egGZYi4n3OLWX22GsBCYPx-efYNvePZQ6GEYT1SIvaIgZA",
    "y": "RuOLBSMJmD-BK5URkjwP32MoGLRzmyqNUIrdTpBOwnGP2BZepXzMNu9114YvMOoG"
  }
}

export default defineComponent({
  components: { Loki },
  setup() {
    const ledger = ref(JSON.parse(localStorage.getItem('ledger')));

    return { ledger, user }
  },
})
</script>
