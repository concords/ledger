<template>
  <div class="overflow-y-auto flex flex-col flex-1">
    <div class="w-full sticky top-0 bg-white shadow">
      <div class="flex p-4 rounded-b w-full md:w-3/4 lg:w-2/3 m-auto">
        <input
          v-model="newItemInput"
          placeholder="New Todo Item..."
          class="p-2 rounded border border-gray-400 flex-1 mr-2"
          @keyup.enter="addItem"
        >
        <button
          class="cursor:pointer block mx-auto py-2 px-4 rounded bg-green-400 hover:bg-green-500 text-white"
          @click="addItem"
        >
          Add Todo
        </button>
      </div>
    </div>
    <ul
      v-if="items.length"
      class="my-8 mx-auto w-full md:w-3/4 lg:w-2/3 my-2 px-2 flex-1 px-6"
    >
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
              <div class="flex justify-between py-2">
                <span class="">Created {{ dateFromNow(item.created_at) }}</span>
                <img
                  :src="`https://robohash.org/${item.created_by.x}${item.created_by.y}`"
                  class="inline-block w-4 h-4 ring-white shadow rounded-full ml-4 border border-gray-400"
                >
              </div>
              <div class="flex justify-between">
                <span class="">Last updated {{ dateFromNow(item.updated_at || item.created_at) }}</span>
                <img
                  :src="`https://robohash.org/${item.user.x}${item.user.y}`"
                  class="inline-block w-4 h-4 ring-white shadow rounded-full ml-4 border border-gray-400"
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
      console.log(props.user);
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
