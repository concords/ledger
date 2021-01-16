<template>
  <div>
    <h1 class="text-3xl">
      Concords Playground
    </h1>

    <authenticated>
      <template #logged-in>
        <concord @close="closeActiveDoc" />
        <button
          class="bg-blue-500 text-white py-2 px-4"
          @click="createDocument"
        >
          Create Document
        </button>
        
        <button
          class="block bg-red-500 text-white py-2 px-4"
          @click="logout"
        >
          Logout
        </button>
      </template>
      <template #not-logged-in>
        <button
          class="bg-blue-500 text-white py-2 px-4"
          @click="create"
        >
          Create Some Keys
        </button>
      </template>
    </authenticated>
  </div>
</template>

<script>
import { watch } from 'vue';
import { Authenticated, Concord } from '@teamconcords/ui-kit';
import { useAuthentication, useDocument, useConcord } from '@teamconcords/use';

export default {
  components: { Authenticated, Concord },
  setup() {
    const { create, logout, isAuthenticated } = useAuthentication();
    const { createDocument, closeDocument, documents, setDocuments, loadDocument } = useDocument();
    const { concord } = useConcord();

    const openDocument = (id) => {
      if (concord.value) {
        const { close } = concord.value;
        close();
      }
      const doc = JSON.parse(sessionStorage.getItem(id))
      if (doc) {
        loadDocument(doc.tree);
      }
    }

    const closeActiveDoc = () => {
      const { close } = concord.value;
      closeDocument();
      close();
      sessionStorage.removeItem('active-doc');
    };

    watch(isAuthenticated, (isAuth) => {
      if (!isAuth) {
        return;
      }
      const activeDoc = sessionStorage.getItem('active-doc');
      if (activeDoc) {
        openDocument(activeDoc);
      }
    })

    return {
      create,
      logout,
      createDocument,
      documents,
      closeActiveDoc,
    };
  },
};
</script>
<style>
@tailwind base;
@tailwind components;
@tailwind utilities;
</style>