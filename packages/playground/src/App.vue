<template>
  <h1 class="text-3xl">Concords Playground</h1>
  
  <authenticated>
    <template #logged-in>
      Logged In

      <button
        @click="logout"
        class="bg-blue-500 text-white py-2 px-4">
        Logout
      </button>
    </template>
    <template #not-logged-in>
      Not Logged In

      <button
        @click="create"
        class="bg-blue-500 text-white py-2 px-4">
        Create Some Keys
      </button>
    </template>
  </authenticated>
</template>

<script>
import { Authenticated } from '@teamconcords/ui-kit';
import { useAuthentication } from '@teamconcords/use';

export default {
  components: { Authenticated },
  setup() {
    const { create, logout } = useAuthentication();

    return { create, logout };
  },
};
</script>
<style>
@tailwind base;
@tailwind components;
@tailwind utilities;
</style>