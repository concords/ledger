
export interface Identity {
  x: string,
  y: string,
}
export interface AuthKeys {
  secret: string,
  identity: Identity,
};

/**
 * Create Signing Key pair
 *
 * ```typescript
 * const {
 *   identity: Identity,
 *   secrte: string,
 * } = await create();
 *
 * ```
 */
export const create = async (): Promise<AuthKeys> => {
  const signingKey = await crypto.subtle.generateKey(
    { name: "ECDSA", namedCurve: "P-384" },
    true,
    ["sign", "verify"]
  );

  const publicSigningKey: JsonWebKey = await crypto.subtle.exportKey('jwk', signingKey.publicKey) as JsonWebKey;
  const privateSigningKey: JsonWebKey = await crypto.subtle.exportKey('jwk', signingKey.privateKey) as JsonWebKey;

  return {
    secret: privateSigningKey.d,
    identity: { x: publicSigningKey.x, y: publicSigningKey.y },
  };
}

/**
 * Import active Signing Key
 *
 * ```typescript
 * const signingKey = await importSigningKey(identity, secret);
 *
 * ```
 */
export const importSigningKey = (
    identity: Identity,
    secret: string
  ): Promise<CryptoKey> => {
  
    if (!identity || !secret) {
      return;
  }

  return crypto.subtle.importKey(
    'jwk',
    {
      crv: "P-384",
      ext: true,
      kty: "EC",
      ...identity, d: secret },
    {
        name: 'ECDSA',
        namedCurve: "P-384",
    },
    true,
    ["sign"],
  );
}


/**
 * Verify signature
 *
 * ```typescript
 * const signingKey = await importSigningKey(identity, secret);
 *
 * ```
 */
export const verifySignature = async (identity: Identity, signature, data: Object): Promise<Boolean> => {
  const key = await crypto.subtle.importKey(
    'jwk',
    {
      crv: "P-384",
      ext: true,
      kty: "EC",
      ...identity },
    {
        name: 'ECDSA',
        namedCurve: "P-384",
    },
    true,
    ["sign"],
  );

  const u8data = new TextEncoder().encode(JSON.stringify(data));
  const u8signature = new Uint8Array(atob(signature).split('').map((c) => c.charCodeAt(0)));

  return crypto.subtle.verify(
    {
        name: "ECDSA",
        hash: {name: "SHA-384"},
    },
    key,
    u8signature,
    u8data,
);
}

// const importEncryptionKey = (jwk: string, key: JsonWebKey): Promise<CryptoKey> => {
//   if (!jwk) {
//       return;
//   }
  
//   delete key.key_ops;

//   return crypto.subtle.importKey(
//     'jwk',
//     { ...key, d: jwk },
//     {
//         name: 'ECDH',
//         namedCurve: "P-384",
//     },
//     true,
//     ["deriveKey", "deriveBits"]
//   );
// }
// const publicEncryptionKey: JsonWebKey = await crypto.subtle.exportKey('jwk', encryptionKey.publicKey) as JsonWebKey;
//   const privateEncryptionKey: JsonWebKey = await crypto.subtle.exportKey('jwk', encryptionKey.privateKey) as JsonWebKey;

// const encryptionKey = await window.crypto.subtle.generateKey(
//   {
//     name: "ECDH",
//     namedCurve: "P-384"
//   },
//   true,
//   ["deriveKey"]
// );

  // const verifyEncryptionKey = (publicKey, signature, transaction) =>
  // crypto.subtle.verify(
  //     {
  //         name: "ECDSA",
  //         hash: {name: "SHA-384"},
  //     },
  //     publicKey,
  //     signature,
  //     transaction,
  // );
