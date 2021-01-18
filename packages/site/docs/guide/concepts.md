## Identity

Uses an ECDSA key-pair to sign and verify transactions commit to the ledger.

It's recommended to keep your SigningKey public, but you must never share your SigningSecret.

```typescript
import { auth } from '@concords/core';

const { create, importSigningKey } = auth;

const {
  signingKey,
  signingSecret,
} = await create();

const activeSigningKey = await importSigningKey(signingKey, signingSecret);

```
## Document

```typescript
import { document } from '@concords/core';

const { create, verify, load } = document;

const documentTree = await create(activeSigningKey, 1);
const isTreeValid = await verify(documentTree);

const concord = await load(
    profile: {
      ...details,
      signingKey,
    },
    activeSigningKey,
    documentTree,
    ['todos'], // array of data table names
    reactiveCallback,
  );

```
## Concord

```typescript
concord.create('todos', {
  title: 'Schemaless data',
  description: '',
});

```

## Reactive Callback
Raw JSON representation of the state tree.
```typescript

const reactiveCallback = async (newTree) => {
  const todos = await concord.get('todos');
  todos.forEach(({
    id, data, signature
  }) => {})
}
```