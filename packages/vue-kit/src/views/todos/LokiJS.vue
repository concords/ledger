<template>
  <div>
    <h1 class="text-3xl text-center">
      Todo App
    </h1>
    <h2 class="text-xl text-center">
      @concords/ledger & LokiJS
    </h2>
    <div class="mx-auto lg:w-1/2 md:w-3/4 my-2 px-2">
      <div class="flex justify-end">
        <input
          v-model="filters.searchTerm"
          placeholder="Search Items"
          class="p-2 right rounded-full border border-gray-400 w-64 m-2 align-right"
        >
        <label class="py-4 ml-2">
          <input
            v-model="filters.showCompleted"
            type="checkbox"
          >
          Show Completed
        </label>
      </div>
      <ul>
        <li
          v-for="todo in filteredList"
          :key="todo.id"
        > 
          <label>
            <input
              v-model="todo.completed"
              type="checkbox"
              class="mr-4"
              @click="completeItem(todo)"
            >
            <span>{{ todo.title }}</span>
          </label>
        </li>
      </ul>
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
import { defineComponent, ref, watch, reactive, computed } from 'vue';
import ledger from '@concords/ledger';
import loki from 'lokijs';

const useLokiPlugin = (db) => {
  let collection;

  function createCollection({ ledger }) {
    collection = db.addCollection(ledger.id, { disableMeta: true });
  }

  return {
    getCollection: () => collection,
    plugin: {
      onLoad: createCollection,
      onAdd(record) {
        collection[
          record.data.$loki ? 'update' : 'insert'
        ](record.data);
      },
    },
  };
};

const localStoragePlugin = {
  onUpdate({ ledger }) {
    localStorage.setItem('ledger', JSON.stringify(ledger));
  },
};

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
    
    const filters = reactive({
      searchTerm: '',
      showCompleted: true,
    });

    const { add, commit } = ledger({
      ...props.user,
      ledger: props.ledger,
      plugins: [
        localStoragePlugin,
        lokiPlugin,
        {
          onReady: handleUpdates,
          onUpdate: handleUpdates,
        }
      ],
    });

    function addItem() {
      add({ title: itemInput.value, completed: false });
      itemInput.value = '';
    }

    function completeItem(todo) {
      add({ ...todo, completed: !todo.completed });
    }

    const filteredList = ref([]);

    function handleUpdates({ ledger }) {
      const collection = getCollection();

      filteredList.value = collection.where((item) => {
        // filter completed items
        if (!filters.showCompleted && item.completed) {
          return false
        }

        // filter by search term
        if (filters.searchTerm) {
          return new RegExp(filters.searchTerm.toLowerCase())
            .test(item.title.toLowerCase());
        }
        return true;
      });

      if (ledger) {
       canCommit.value = ledger.pending_transactions.length;
       file.value = new Blob([JSON.stringify(ledger, null, 2, 2)], { type: 'text/json' });
       emit('update:ledger', ledger);
      }
    }
    watch(filters, handleUpdates);
      
    const keyHref = computed(() => !file.value || URL.createObjectURL(file.value));

    return {
      addItem,
      commit,
      itemInput,
      filters,
      todos,
      completeItem,
      canCommit,
      filteredList,
      keyHref,
    }
  },
})
</script>