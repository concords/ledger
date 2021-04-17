# A tamper-proof Javascript data-ledger.

> ## concord
> /ˈkɒŋkɔːd/
>
> agreement or harmony between people or groups.

---
[![NPM](https://img.shields.io/npm/v/@concords/ledger)](https://www.npmjs.com/package/@concords/ledger)
[![codecov](https://codecov.io/gh/concords/ledger/branch/main/graph/badge.svg?token=YGJMR1YSMA)](https://codecov.io/gh/concords/ledger)
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

### Identity

To ensure integrity in the ledger, Concords uses an ECDSA key-pair to sign and verify transactions added to the ledger. The Keys are generated in the users browser using the [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API).

![Identity](../assets/brand/logos/identity)

[Docs](https://docs.concords.app/guide/identity.html) | [TypeDoc](https://typedoc.concords.app/modules/identity_src.html)


![Ledger](../assets/brand/logos/ledger)