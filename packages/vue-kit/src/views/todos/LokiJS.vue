<template>
  <div>
    <h1>Vue Todo List</h1>
    <h2>@concords/ledger & LokiJS</h2>
    <div>
      <input v-model="itemInput">
      <button @click="addItem">
        Add Todo
      </button>
      <ul>
        <li
          v-for="todo in todos"
          :key="todo.id"
        >
          <button @click="completeItem(todo)">
            <svg
              class="t-icon"
              :class="{'t-icon--is-completed' : todo.completed}"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </button>
          <span>{{ todo.title }}</span>{{ todo.completed }}
        </li>
      </ul>
      <button @click="commit">
        Save
      </button>
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

    const {
      collection,
      plugin: lokiPlugin
    } = useLokiPlugin(new loki('ledger.db'));

    const itemInput = ref('');

    const { add, commit } = ledger({
      ...props.user,
      ledger: props.ledger,
      plugins: [
        localStoragePlugin,
        lokiPlugin,
        {
          onUpdate() {
            todos.value = collection.value.data;
          },
          onReplay() {
            todos.value = collection.value.data;
          }
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

    return { addItem, commit, itemInput, todos, completeItem }
  },
})
</script>
<style>
.t-icon {
  width: 16px;
  height: 16px;
  color: lightgrey;
}

.t-icon--is-completed {
  color: green;
}
</style>