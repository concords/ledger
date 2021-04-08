<template>
  <div class="flex flex-col sticky top-0 justify-between p-4 text-center">
    <div class="flex flex-col">
      <button
        class="w-full my-2 py-2 px-4 text-white rounded bg-indigo-600 disabled:opacity-30"
        :class="!pendingChanges ? 'cursor-not-allowed' : 'hover:bg-indigo-700'"
        :disabled="!pendingChanges"
        @click="$emit('commit')"
      >
        Commit
      </button>
      <a
        :href="!pendingChanges ? keyHref : ''"
        download="loki-todo-ledger.json"
        class="w-full my-2 py-2 px-4 text-white rounded border-0 bg-green-500 "
        :class="pendingChanges ? 'pointer-events-none cursor-not-allowed opacity-30' : 'hover:bg-green-600'"
      >
        Download
      </a>
    </div>
    <div>
      <button
        class="w-full py-2 px-4 text-white rounded bg-red-600 disabled:opacity-50"
        @click="$emit('delete')"
      >
        Close Ledger
      </button>
    </div>
  </div>
</template>
<script>
import { watch, ref, computed } from 'vue';

export default {
  props: {
    ledger: {
      type: Object,
      default: null,
    },
  },
  emits: ['commit', 'delete', 'create'],
  setup(props) {
    const pendingChanges = ref(false);
    const file = ref('');

    watch(() => props.ledger, (ledger) => {
      pendingChanges.value = ledger.pending_records.length;
      file.value = new Blob([JSON.stringify(ledger, null, 2, 2)], { type: 'text/json' });
    });
    
    const keyHref = computed(() => !file.value || URL.createObjectURL(file.value));

    return { pendingChanges, keyHref }

  },
}
</script>