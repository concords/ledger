<template>
  <div>
    <pre>{{ ledger.chain }}</pre>
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
