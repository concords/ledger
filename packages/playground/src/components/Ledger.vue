<template>
  <div v-if="loaded">
    <ul>
      <li
        v-for="todo in todos"
        :key="todo.id"
      >
        {{ todo.title }}
      </li>
    </ul>
    <button @click="createTodo">
      Add Todo
    </button>
  </div>
</template>
<script>
import { reactive, toRefs } from 'vue';
import ledger from '@concords/core/src/ledger';

const useTodoPlugin = () => {
  const store = reactive({
    loaded: false,
    todos: [],
  });

  return {
    store,
    plugin: {
      loaded(ledger) {
        store.loaded = true;
      },
      createRecord({ type, data }) {
        store.todos = [...store.todos, data];
      },
    }
  };
}

export default {
  props: {
    identity: {
      type: Object,
      required: true,
    },
    secret: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const todo = useTodoPlugin();

    const { createRecord } = ledger({
      identity: props.identity,
      secret: props.secret,
      plugins: [todo.plugin],
    });

    function createTodo() {
      createRecord('todos', { title: 'Hi There' })
    }

    return {
      ...toRefs(todo.store),
      createTodo
    }
  },
}
</script>