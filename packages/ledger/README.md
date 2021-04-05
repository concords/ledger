# An immutable Javascript data-ledger.

> ## concord
> /ˈkɒŋkɔːd/
>
> agreement or harmony between people or groups.

## Getting Started

```bash
$ npm install @concords/ledger @concords/identity --save
```

### Ledger

```javascript
import Ledger from '@concords/ledger';

const {
  auth,
  load,
  replay,
  commit,
  add,
} = Ledger({
  plugins,
});
```

### Plugins

```javascript

// Local Storage plugin
const lsPlugin = {
  onLoad({ ledger }) {
    localStorage.setItem('ledger', JSON.stringify(ledger))
  },
  onUpdate({ ledger }) {
    localStorage.setItem('ledger', JSON.stringify(ledger))
  },
};

const useTodoStore = () => {
  let todos = [];

  return {
    todos,
    plugin: {
      async onRecord(record) {
        const index = todos.findIndex(({ id }) => id === record.data.id);
        
        if (index > -1) {
          todos.splice(index, 1, record.data);
        } else {
          todos = [...todos, record.data];
        }
      }
    }
  };
}

const { todos, plugin: todoPlugin } = useTodoStore();
const { add, load } = Ledger({
  plugins: [
    lsPlugin,
    todoPlugin,
    {
      onUpdate() {
        console.log(todos);
      }
    }
  ]
});

```

### Load


### Identity

```JSON
{
  "secret": "JRxW6TjcK76B1KLKi7uo5syiKAFkgPWmSb6cmnv95i2cV5mClSv1dYCDD8uuYs3S",
  "identity": {
    "x": "ztE--LL6yBgQOy7Yr6egGZYi4n3OLWX22GsBCYPx-efYNvePZQ6GEYT1SIvaIgZA",
    "y": "RuOLBSMJmD-BK5URkjwP32MoGLRzmyqNUIrdTpBOwnGP2BZepXzMNu9114YvMOoG"
  }
}
```

```bash
$ npm install @concords/identity --save
$ yarn add @concords/identity
```

``` javascript
import { createIdentity } from '@concords/identity';

const user = await createIdentity();
await auth(user);
```

```javascript
import Ledger from '@concords/ledger';
import { createIdentity } from '@concords/identity';

export default async function() {
  

  load();

  function addItem() {
    record({
        title: `Task ${todos.length + 1}`,
        completed: false,
      }
    );
  }

  function completeItem(todo) {
    record({
        ...todo,
        completed: !todo.completed
      }
    );
  }
};
```
