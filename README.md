# A tamper-proof Javascript data-ledger.

> ## concord
> /ˈkɒŋkɔːd/
>
> agreement or harmony between people or groups.

---
[![NPM](https://img.shields.io/npm/v/@concords/ledger)](https://www.npmjs.com/package/@concords/ledger)
[![MIT](https://img.shields.io/github/license/concords/ledger)](https://github.com/concords/ledger/blob/main/COPYING)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

Demo App 👉 https://demo.concords.app

TypeDocs 👉 https://typedoc.concords.app

----


## Getting Started

```bash
$ npm install @concords/ledger --save

$ yarn add @concords/ledger
```

### Ledger

```javascript
import ledger from '@concords/ledger';

const {
  auth,
  load,
  create,
  replay,
  commit,
  add,
  destroy,
} = ledger();
```

### Auth

To ensure integrity in the ledger, Concords uses an ECDSA key-pair to sign and verify transactions added to the ledger. The Keys are generated in the users browser using the [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API).

[Docs](https://docs.concords.app/guide/identity.html) | [TypeDoc](https://typedoc.concords.app/modules/identity_src.html)

```JSON
{
  "secret": "JRxW6TjcK76B1KLKi7uo5syiKAFkgPWmSb6cmnv95i2cV5mClSv1dYCDD8uuYs3S",
  "identity": {
    "x": "ztE--LL6yBgQOy7Yr6egGZYi4n3OLWX22GsBCYPx-efYNvePZQ6GEYT1SIvaIgZA",
    "y": "RuOLBSMJmD-BK5URkjwP32MoGLRzmyqNUIrdTpBOwnGP2BZepXzMNu9114YvMOoG"
  }
}
```


### Plugins

Example using [LokiJS](https://github.com/techfort/LokiJS)

```javascript
// plugin.js
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
```

```javascript
import ledger from '@concords/ledger';
import loki from 'lokijs';
import useLokiPlugin from './plugin';

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

const { add, commit } = ledger({
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
```