<template>
  <authenticated>
    <template #logged-in>
      Logged In
    </template>
    <template #not-logged-in>
      Not Logged In

      <button @click="create">Create</button>
    </template>
  </authenticated>
</template>

<script>
import { Authenticated } from '@teamconcords/ui-kit';
import { useAuthentication } from '@teamconcords/use';

export default {
  components: { Authenticated },
  setup() {
    const { create } = useAuthentication();

    return { create };
  },
};
</script>