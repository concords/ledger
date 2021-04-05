<template>
  <div class="w-full flex flex-col">
    <div v-if="concord && !isLoading"> 
      Loaded and concord

      <button @click="$emit('close')">Close</button>
    </div>
  </div>
</template>
<script>
import { useConcord } from '@teamconcords/use';

export default {
  name: 'Concord',
  emits: ['close'],
  setup () {
    // const { document, createDocument, isValid, commit } = useDocument();
    const { concord, isLoading } = useConcord();

    return {
      concord,
      isLoading,
    }
  },
};
</script>
