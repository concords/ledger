<template>
  <div class="flex-1 overflow-y-auto shadow-inner p-2">
    <pre class="text-xs">{{ ledger.chain }}</pre>
  </div>
</template>
<script>
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    user: {
      type: Object,
      required: true,
    },
    ledger: {
      type: Object,
      default: null,
    },
  },
  setup() {
    
  },
})
</script>
