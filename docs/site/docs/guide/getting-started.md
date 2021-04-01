# Getting Started

## Installation

Install the core package 

```bash
npm install @concords/core --save
# yarn add @concords/core
```

## API

### Document

Concords is a functional library, documents can be loaded alongside a Signing Key and modified directly in the browser. Transactions are commit to the ledger and then become immutable.

The ledger can then be exported, imported and processed outside of the application and stored to any storage solution.

To create a new ledger, you need to pass a [user identity](/guide/identity.html)
```typescript
import { document } from '@concords/core';

const { create, verify, load } = document;

const documentTree = await create(activeSigningKey);
const isTreeValid = await verify(documentTree);

const concord = await load(
    profile: {
      ...details,
      signingKey,
    },
    activeSigningKey,
    documentTree,
    ['todos', 'notes', 'columns', 'custom_data_set'], // table names
    (newTree) => {
      // Reactive callback
    },
  );
```
### Concords

When interacting with a concords document, all transactions are added to the transaction pool. They are recorded to the database and signed for user integrity, but they do not make up part of the ledger.

```typescript
// Create schemaless data entries
await concord.create('todos', {
  title: 'Schemaless data',
  description: '',
});

// get all DB entries
const todos = await concord.get('todos');

// Update exisiting entries
await concord.update('todos', {
  ...todos[0],
  description: 'With a due date',
  due_date: '30-01-2021',
});
```

#### Commit

To add transactions to the ledger you must perform a commit action. This will use the Proof of Work algorithm to commit the transaction block to the ledger. Once committed, this data is now mimutable and any attempts to manipulate the data will invalidate the ledger.

```typescript
await concord.commit();
```