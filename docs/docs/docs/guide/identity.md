# Identity

To ensure integrity in the ledger, Concords uses an ECDSA key-pair to sign and verify transactions added to the ledger. The Keys are generated in the users browser using the [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API), which keeps things decentralized.

Concords can work along side your exisiting authentication. It's recommended to keep a Signing Key public, you can store that as a public identifier aginst a user profile. The Signing Secret should be considered private and treated in the same way you would a user password.

## Signing Key

To interact with a concords ledger you must provide a valid Signing Key.

```typescript
import { auth } from '@concords/core';

const { create, importSigningKey } = auth;

const {
  signingKey: CryptoKey,
  signingSecret: CryptoKey,
} = await create();

const activeSigningKey: CryptoKey =
  await importSigningKey(signingKey, signingSecret);

```

## Encryption Key

When creating an identity, concords also returns an encryption key. We haven't fully purposed it yet, but feel free to use it. We're exploring ledger user-roles and permissions. 🔑 🤞

```typescript
import { auth } from '@concords/core';

const { create } = auth;

const {
  signingKey: CryptoKey,
  signingSecret: CryptoKey,

  encryptionKey: CryptoKey,
  encryptionSecret: CryptoKey,
} = await create();

```