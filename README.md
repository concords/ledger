# Concords


## concords/core

### Event Hooks

The concords runtime uses an event based plugin system.

```javascript
const plugin = () => {
  return {
    created(ledger) {},
    loaded(ledger) {},
    updated(ledger) {},
    unloaded(ledger) {},
    updateRecord({ type, data }) {},
    createRecord({ type, data }) {},
    deleteRecord({ type, data }) {},
  }
}
```

These hooks can be used to update state, send API requests, update IndexedDB.

```javascript
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
```
