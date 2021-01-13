<template>
  <section>
    <slot name="logged-in" v-if="isAuthenticated"/>
    <slot v-else name="not-logged-in"/>
  </section>
</template>

<script>
import { useAuthentication } from '@teamconcords/use';

export default {
  name: 'Authenticated',
  setup() {
    const { isAuthenticated, sessionLogin } = useAuthentication();

    sessionLogin();
    
    return {
      isAuthenticated,
    }
  },
};
</script>
