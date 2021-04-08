<template>
  <div class="flex flex-col flex-1 overflow-hidden bg-gray-50">
    <div class="flex p-2 justify-between shadow-inner bg-white border-b border-gray-200">
      <h1 class="py-2 text-3xl truncate">
        Ledger JSON
      </h1>
    </div>
    <div class="overflow-y-auto flex-1 shadow-inner p-2 bg-gray-900">
      <pre class="text-sm text-gray-200 font-medium">{{ ledger }}</pre>
    </div>
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
