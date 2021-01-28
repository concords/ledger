<template>
  <div>
    <button v-if="!authKeys" @click="createUser" class="bg-green-400">
      Create Identity
    </button>
    <button v-if="!ledger && authKeys" @click="create">
      Create Ledger
    </button>
    <div v-if="ledger">
      <button @click="addAdminUser">
        Add Admin User
      </button>
      <pre>{{ JSON.stringify(ledger, null, 2, 2) }}</pre>
    </div>
  </div>
</template>

<script>
import { ref, watch, unref, onMounted } from 'vue';
import concords from '@concords/core/src/concord';
import { create as createIdentity, importSigningKey } from '@concords/core/src/identity';

export default {
  setup() {
    const { registerHooks, createRecord, createLedger } = concords();
    
    const ledger = ref(null);
    const authKeys = ref(null);
    const signingKey = ref(null);

    watch(authKeys, async ({ identity, secret }) => {
      signingKey.value = await importSigningKey(identity, secret);
    });

    const createUser = async () => {
      authKeys.value = await createIdentity();
    }

    registerHooks({
      'create:ledger': [
          (newLedger) => ledger.value = newLedger
      ],
      'update:ledger': [
          (newLedger) => ledger.value = newLedger
      ],
    });

    const addAdminUser = async (value) => {
      createRecord(
        'user',
        {
          type: 'admin',
          identity: unref(authKeys).identity,
          permissions: [],
        },
        unref(signingKey)
      );
    }

    const create = () => 
      createLedger({ data: 1 }, unref(signingKey));


    return {
      addAdminUser,
      createUser,
      create,
      ledger,
      authKeys,
    }
  },
};
</script>
<style>
@tailwind base;
@tailwind components;
@tailwind utilities;
</style>