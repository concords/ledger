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
          <input
            v-model="todo.completed"
            type="checkbox"
            @click="completeItem(todo)"
          >
          <span>{{ todo.title }}</span>
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