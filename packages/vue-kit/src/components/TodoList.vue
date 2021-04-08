<template>
  <div class="flex flex-col flex-1 bg-gray-50 m-2">
    <div class="w-full sticky top-2 bg-white shadow bg-white">
      <div class="flex rounded-b w-full m-auto">
        <input
          v-model="newItemInput"
          placeholder="New Todo Item..."
          class="py-4 px-2 border-0 flex-1"
          @keyup.enter="addItem"
        >
        <button
          class="cursor:pointer block mx-auto py-2 px-4 bg-green-400 hover:bg-green-500 text-white"
          @click="addItem"
        >
          Add Todo
        </button>
      </div>
    </div>
    <ul
      v-if="items.length"
      class="mx-auto w-full flex-1 py-2 px-4 overflow-y-scroll"
    >
      <li
        v-for="item in items"
        :key="item.id"
        class="rounded bg-white p-4 my-2 shadow"
      > 
        <div class="flex justify-between">
          <label>
            <input
              v-model="item.completed"
              type="checkbox"
              class="mr-4"
              @click="completeItem(item)"
            >
            <span class="text-lg font-thin">{{ item.title }}</span>
          </label>
          <div class="flex">
            <div class="flex flex-col text-sm leading-6 text-gray-500 text-right">
              <div class="flex justify-between py-2">
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
      </li>
    </ul>
    <div
      v-else
      class="text-center py-10 text-6xl font-medium text-gray-400"
    >
      Nothing to see here.
      <p class="text-sm py-8 font-thin">
        (pssst. Add your first task or adjust your filters)
      </p>
    </div>
  </div>
</template>
<script>
import { defineComponent, ref } from 'vue';
import { formatRelative } from 'date-fns';

export default defineComponent({
  props: {
    items: {
      type: Array,
      default: () => ([]),
    },
    user: {
      type: Object,
      required: true,
    },
  },
  emits: [
    'addItem',
  ],
  setup(props, { emit }) {
    const newItemInput = ref('');

    function dateFromNow(date) {
      return formatRelative(new Date(date), new Date());
    }

    function addItem() {
      emit('addItem', {
        id: Date.now(),
        title: newItemInput.value,
        completed: false,
        created_at: Date.now(),
        created_by: props.user.identity,
      });
      newItemInput.value = '';
    }

    function completeItem(todo) {
      emit('addItem', {
        title: todo.title,
        created_at: todo.created_at,
        created_by: todo.created_by,
        updated_by: props.user.identity,
        updated_at: Date.now(),
        id: todo.id,
        completed: !todo.completed
      });
    }

    return {
      dateFromNow, addItem, completeItem, newItemInput
    }
  },
})
</script>
