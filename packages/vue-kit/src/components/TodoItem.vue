<template>
  <div
    v-if="item"
    class="flex justify-between rounded bg-white p-4 my-2 shadow"
  >
    <label>
      <input
        :checked="item.completed"
        type="checkbox"
        disabled
        class="mr-4"
      >
      <span class="text-lg font-thin">{{ item.title }}</span>
    </label>
    <div class="flex">
      <div class="flex flex-col text-sm leading-6 text-gray-500 text-right">
        <div
          v-if="item.created_at"
          class="flex justify-between py-2">
          <span class="block w-full">Created {{ dateFromNow(item.created_at) }}</span>
          <img
            :src="`https://robohash.org/${item.created_by.x}${item.created_by.y}`"
            class="inline-block w-6 h-6 ring-white shadow rounded-full ml-4 border border-gray-400"
          >
        </div>
        <div
          v-if="item.updated_at"
          class="flex justify-between"
        >
          <span class="block w-full">Last updated {{ dateFromNow(item.updated_at) }}</span>
          <img
            :src="`https://robohash.org/${item.updated_by.x}${item.updated_by.y}`"
            class="inline-block w-6 h-6 ring-white shadow rounded-full ml-4 border border-gray-400"
          >
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { formatRelative } from 'date-fns';

export default {
  props: {
    item: {
      type: Object,
      default: null,
    }
  },
  setup() {
    function dateFromNow(date) {
      return formatRelative(new Date(date), new Date());
    }

    return { dateFromNow };
  },
}
</script>