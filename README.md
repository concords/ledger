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
<<<<<<< HEAD
const useTodoPlugin = () => {
  const store = reactive({
    loaded: false,
    todos: [],
=======
  import { createIdentity } from '@concords/core/identity';
  import { ledger } from '@concords/core/ledger'

  const { identity, secret } = await createIdentity();
  const signingKey = await importSigningKey(identity, secret);
  
  const {
    createLedger,
    loadLedger,
    createRecord,
    updateRecord,
    destroyLedger,
    registerHooks,
  } = ledger();

  registerHooks({
    'create:ledger': [
        (ledger) => console.log(ledger),
    ],
    'update:ledger': [
        (ledger) => console.log(ledger),
    ],
    'create:transaction': [
        (data) => console.log(data),
        (data) => api.post('endpoint', data),
    ],
>>>>>>> 332b52d6ea17a1961000495bdae999995b63fd74
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

```javascript
import ledger from '@concords/core/src/ledger';

const { createRecord } = ledger({
  ...auth,
  plugins: [
    plugin(),
  ],
});

...

createRecord('table_name', { title: 'data info' }) {

},
```
