<template>
  <div class="px-4">
    <filters
      v-model:searchTerm="searchFilter"
      v-model:showCompleted="showCompletedFilter"
    />

    <div class="mx-auto lg:w-1/2 md:w-3/4 my-2 px-2">
      <todo-list
        :items="filteredList"
        @update:item="completeItem"
      />

      <div class="flex-col mt-6 space-between">
        <div class="flex mb-2">
          <input
            v-model="itemInput"
            placeholder="New Todo Item..."
            class="p-2 rounded border border-gray-400 flex-1 mr-2"
          >
          <button
            class="block mx-auto py-2 px-4 text-primary-700 rounded border border-primary-500"
            @click="addItem"
          >
            Add Todo
          </button>
        </div>
        <div class="flex justify-end">
          <button
            class="mr-2 py-2 px-4 text-indigo-700 rounded border border-indigo-500 disabled:opacity-50"
            :class="!canCommit ? 'cursor-not-allowed text-gray-400' : ''"
            :disabled="!canCommit"
            @click="commit"
          >
            Commit
          </button>
          <a
            :href="!canCommit ? keyHref : ''"
            download="loki-todo-ledger.json"
            class="py-2 px-4 text-white rounded border-0"
            :class="canCommit ? 'pointer-events-none cursor-not-allowed bg-green-200' : 'bg-green-500 hover:bg-green-600'"
          >
            Download
          </a>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { defineComponent, ref, watch, computed } from 'vue';
import ledger from '@concords/ledger';
import loki from 'lokijs';

import Filters from './Filters.vue';
import TodoList from './TodoList.vue';

import useLokiPlugin from '../../composables/useLokiPlugin';

export default defineComponent({
  components: { Filters, TodoList },
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
  emits: [
    'update:ledger',
  ],
  setup(props, { emit }) {
    const todos = ref([]);
    const canCommit = ref(false);
    const file = ref(null);

    const {
      getCollection,
      plugin: lokiPlugin
    } = useLokiPlugin(new loki('ledger.db'));

    const itemInput = ref('');
    const searchFilter = ref('');
    const showCompletedFilter = ref(true);

    const { add, commit } = ledger({
      ...props.user,
      ledger: props.ledger,
      plugins: [
        lokiPlugin,
        {
          onReady: handleUpdates,
          onUpdate: handleUpdates,
        }
      ],
    });

    function addItem() {
      add({
        id: Date.now(),
        title: itemInput.value,
        completed: false,
        created_at: Date.now()
      });
      itemInput.value = '';
    }

    function completeItem(todo) {
      add({
        title: todo.title,
        created_at: todo.created_at,
        id: todo.id,
        completed: !todo.completed,
        updated_at: Date.now()
      });
    }

    const filteredList = ref([]);

    function handleUpdates({ ledger }) {
      const collection = getCollection();

      filteredList.value = collection.chain()
        .where((item) => {
          // filter completed items
          if (!showCompletedFilter.value && item.completed) {
            return false
          }

          // filter by search term
          if (searchFilter.value) {
            return new RegExp(searchFilter.value.toLowerCase())
              .test(item.title.toLowerCase());
          }
          return true;
        })
        .compoundsort([['timestamp', true], ['title', true]])
        .data();

      if (ledger) {
       canCommit.value = ledger.pending_transactions.length;
       file.value = new Blob([JSON.stringify(ledger, null, 2, 2)], { type: 'text/json' });
       emit('update:ledger', ledger);
      }
    }
    watch([searchFilter, showCompletedFilter], handleUpdates);
      
    const keyHref = computed(() => !file.value || URL.createObjectURL(file.value));

    return {
      addItem,
      commit,
      itemInput,
      todos,
      completeItem,
      canCommit,
      filteredList,
      keyHref,

      searchFilter,
      showCompletedFilter,
    }
  },
})
</script>