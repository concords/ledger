# Getting Started

## Installation

Install the core package 

```bash
npm install @teamconcords/core --save
# yarn add @teamconcords/core
```
## Identity

```typescript
import { auth } from '@teamconcords/core';

const { create, importSigningKey } = auth;

const {
  signingKey,
  signingSecret,
} = await create();

const activeSigningKey = await importSigningKey(signingKey, signingSecret);

```
## Document

```typescript
import { document } from '@teamconcords/core';

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
