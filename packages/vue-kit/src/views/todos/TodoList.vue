<template>
  <div class="overflow-y-auto flex flex-col flex-1">
    <div class="flex p-4 rounded-b w-full md:w-3/4 lg:w-2/3 m-auto sticky top-0 bg-white shadow">
      <input
        v-model="newItemInput"
        placeholder="New Todo Item..."
        class="p-2 rounded border border-gray-400 flex-1 mr-2"
      >
      <button
        class="cursor:pointer block mx-auto py-2 px-4 rounded bg-green-400 hover:bg-green-500 text-white"
        @click="addItem"
      >
        Add Todo
      </button>
    </div>
    <ul class="my-8 mx-auto w-full md:w-3/4 lg:w-2/3 my-2 px-2 flex-1 px-6">
      <li
        v-for="item in items"
        :key="item.id"
        class="rounded bg-white p-4 my-2"
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
            <div class="flex flex-col text-xs text-gray-500">
              <span class="py-2">Created {{ dateFromNow(item.created_at) }}</span>
              <span>
                Last updated {{ dateFromNow(item.updated_at || item.created_at) }}
              </span>
            </div>
            <img
              :src="`https://robohash.org/${item.user.x}${item.user.y}`"
              class="inline-block w-10 h-10 ring-white shadow rounded-full ml-4 border border-gray-400 my-2"
            >
          </div>
        </div>
      </li>
    </ul>
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
    }
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
        created_at: Date.now()
      });
      newItemInput.value = '';
    }

    function completeItem(todo) {
      emit('addItem', {
        title: todo.title,
        created_at: todo.created_at,
        id: todo.id,
        completed: !todo.completed,
        updated_at: Date.now()
      });
    }

    return {
      dateFromNow, addItem, completeItem, newItemInput
    }
  },
})
</script>
