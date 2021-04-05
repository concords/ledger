<template>
  <div>
    <h1 class="text-3xl text-center">
      Vue Todo List
    </h1>
    <h2 class="text-xl text-center">
      @concords/ledger & LokiJS
    </h2>
    <div class="mx-auto w-3/4 m-4">
      <input
        v-model="itemInput"
        placeholder="New Todo Item..."
        class="p-2 rounded border border-gray-400 w-full"
      >
      <button
        class="block mx-auto my-4 py-2 px-4 text-primary-700 rounded border border-primary-500"
        @click="addItem"
      >
        Add Todo
      </button>
      <ul>
        <li
          v-for="todo in todos"
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
      <div class="flex mt-6">
        <button
          class="py-2 px-4 text-indigo-700 rounded border border-indigo-500 disabled:opacity-50"
          :disabled="!canCommit"
          @click="commit"
        >
          Commit
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import { defineComponent, ref } from 'vue';
import ledger from '@concords/ledger';
import loki from 'lokijs';

const useLokiPlugin = (db) => {
  let collection = ref({});

  return {
    collection,
    plugin: {
      onLoad({ ledger }) {
        collection.value = db.addCollection(ledger.id, { disableMeta: true });
      },
      onCreate({ ledger }) {
        collection.value = db.addCollection(ledger.id, { disableMeta: true });
      },
      onAdd(record) {
        collection.value[
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
  setup(props) {
    const todos = ref([]);
    const canCommit = ref(false);

    const {
      collection,
      plugin: lokiPlugin
    } = useLokiPlugin(new loki('ledger.db'));

    const itemInput = ref('');

    function handleUpdate({ ledger }) {
      canCommit.value = !!ledger.pending_transactions.length;
      todos.value = collection.value.data;
    }

    const { add, commit } = ledger({
      ...props.user,
      ledger: props.ledger,
      plugins: [
        localStoragePlugin,
        lokiPlugin,
        {
          onUpdate: handleUpdate,
          onReplay: handleUpdate
        }
      ],
    });

    function addItem() {
      add({
          title: itemInput.value,
          completed: false,
        }
      );
      itemInput.value = '';
    }

    function completeItem(todo) {
      add({
          ...todo,
          completed: !todo.completed
        }
      );
    }

    return { addItem, commit, itemInput, todos, completeItem, canCommit }
  },
})
</script>