<template>
  <div class="flex justify-end">
    <input
      :value="searchTerm"
      placeholder="Search Items"
      class="p-2 right rounded-full border border-gray-400 w-64 m-2 align-right"
      @input="$emit('update:searchTerm', $event.target.value)"
    >
    <label class="py-4 ml-2">
      <input
        :checked="showCompleted"
        type="checkbox"
        @change="$emit('update:showCompleted', $event.target.checked)"
      >
      Show Completed
    </label>
  </div>
</template>
<script>
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    searchTerm: {
      type: String,
      default: '',
    },
    showCompleted: {
      type: Boolean,
      default: true,
    },
  },
  emits: ['update:searchTerm', 'update:showCompleted'],
})
</script>
