# An immutable Javascript data-ledger.

> ## concord
> /ˈkɒŋkɔːd/
>
> agreement or harmony between people or groups.

## Getting Started

```bash
$ npm install @concords/ledger --save

$ yarn add @concords/ledger
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

load(ledger);
auth(user);
```

### Plugins

Example using https://github.com/techfort/LokiJS

```javascript
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
        const item = collection.findOne({ id: record.data.id });
        if (item) {
          collection.update({ ...item, ...record.data });
        } else {
          collection.insert(record.data);
        }
      },
    },
  };
};

const {
  getCollection,
  plugin: lokiPlugin
} = useLokiPlugin(new loki('ledger.db'));

function handleUpdates({ ledger }) {
  const collection = getCollection();

  list = collection.chain()
    .compoundsort([['created_at', false], ['title', true]])
    .data();
}

const { add } = Ledger({
  ...user,
  ledger,
  plugins: [
    lokiPlugin,
    {
      onReady: handleUpdates,
      onUpdate: handleUpdates,
    }
  ]
});

add({
  title: 'Add any JSON data',
  created_at: Date.now(),
  id: 1
});

```

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
