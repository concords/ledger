# An immutable Javascript data-ledger.

> ## concord
> /ˈkɒŋkɔːd/
>
> agreement or harmony between people or groups.

## @concords/ledger

A blockchain based data-ledger interface for immutable runtime data.

## @concords/identity

The ledger requires an Identity to perform transactions, authentication is handled outside of the ledger.

## Getting Started

```bash
$ npm install @concords/ledger @concords/identity --save
```

```javascript
import Ledger from '@concords/ledger';

export default async function() {
  let todos = [];

  const {
    record,
    load,
    auth,
  } = Ledger({
    plugins: [
      {
        async onRecord(record) {
          const index = todos.findIndex(({ id }) => id === record.data.id);
          
          if (index > -1) {
            todos.splice(index, 1, record.data);
          } else {
            todos = [...todos, record.data];
          }
        }
      }
    ]
  });

  const user = await createIdentity();
  await auth(user);

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
