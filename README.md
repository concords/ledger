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
  });
  

  createLedger({ title: 'Document Name' }, signingKey);
```
