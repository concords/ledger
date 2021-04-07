<template>
  <ul class="mt-8">
    <li
      v-for="item in items"
      :key="item.id"
    > 
      <div class="flex justify-between">
        <label>
          <input
            v-model="item.completed"
            type="checkbox"
            class="mr-4"
            @click="$emit('update:item', item)"
          >
          <span>{{ item.title }}</span>
        </label>
        <span>{{ dateFromNow(item.created_at) }}</span>
      </div>
    </li>
  </ul>
</template>
<script>
import { defineComponent } from 'vue';
import { formatRelative } from 'date-fns';

export default defineComponent({
  props: {
    items: {
      type: Array,
      default: () => ([]),
    }
  },
  emits: [
    'update:item',
  ],
  setup() {
    function dateFromNow(date) {
      return formatRelative(new Date(date), new Date());
    }

    return {
      dateFromNow,
    }
  },
})
</script>
