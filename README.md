# Concords


## concords/core

### Event Hooks

The concords runtime uses an event based plugin system.

```javascript
const events = {
  'create:ledger': [],
  'load:ledger': [],
  'update:ledger': [],
  'unload:ledger': [],
  'create:transaction': [],
  'update:transaction': [],
  'delete:transaction': []
};
```

These hooks can be used to update state, send API requests, update IndexedDB.

```javascript
  import { createIdentity } from '@concords/identity';
  import { concords } from '@concords/core'

  const {
    createLedger,
    loadLedger,
    createRecord,
    updateRecord,
    destroyLedger,
    registerHooks,
  } = concords();

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
  });

  createLedger({ title: 'Document Name' }, signingKey);
```

## concords/core