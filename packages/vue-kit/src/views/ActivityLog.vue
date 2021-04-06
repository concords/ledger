<template>
  <div>
    <pre>
      {{ ledger }}
    </pre>
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
