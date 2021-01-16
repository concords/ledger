<template>
  <div class="flex flex-col w-screen h-screen text-center">
    <h1 class="text-3xl font-black">
      Identity
    </h1>

    <authenticated>
      <template #logged-in>
        <div class="flex-1">
          <profile v-bind="{ signingKey, encryptionKey }" />
        </div>
        <button
          class="block bg-red-500 text-white py-1 px-4 rounded w-64 mx-auto"
          @click="logout"
        >
          Logout
        </button>
      </template>
      <template #not-logged-in>
        <button
          class="bg-blue-500 text-white py-1 px-4 rounded w-64"
          @click="create"
        >
          Create
        </button>
      </template>
    </authenticated>
  </div>
</template>

<script>
import { Authenticated, Profile } from '@teamconcords/ui-kit';
import { useAuthentication } from '@teamconcords/use';

export default {
  components: { Authenticated, Profile },
  setup() {
    const { create, logout, signingKey, encryptionKey } = useAuthentication();

    return {
      create,
      logout,
      signingKey,
      encryptionKey
    };
  },
};
</script>