<template>
  <ledger
    v-if="auth"
    :identity="auth.identity"
    :secret="auth.secret"
  />
</template>

<script>
import { onMounted, ref } from 'vue';
import Ledger from './components/Ledger.vue';
import { create as createIdentity } from '@concords/identity';

export default {
  components: {
    Ledger,
  },
  setup() {
    const auth = ref(null)
    onMounted(async () => {
      auth.value = await createIdentity();
    });

    return {
      auth,
    }
  },
};
</script>
<style>
@tailwind base;
@tailwind components;
@tailwind utilities;
</style>