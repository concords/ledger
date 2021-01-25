
export interface Identity {
  x: string,
  y: string,
}
export interface AuthKeys {
  signingSecret: string,
  signingKey: Identity,
};

/**
 * Creat Signing and Encryption Key pairs
 *
 * ```typescript
 * const {
 *   signingKey: Identity,
 *   signingSecret: string,
 * } = await create();
 *
 * const activeSigningKey: CryptoKey =
 *   await importSigningKey(signingKey, signingSecret);
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
    signingSecret: privateSigningKey.d,
    signingKey: { x: publicSigningKey.x, y: publicSigningKey.y },
  };
}

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


export const importSigningKey = (
    signingKey: Identity,
    signingSecret: string
  ): Promise<CryptoKey> => {
  if (!signingKey || !signingSecret) {
      return;
  }

  return crypto.subtle.importKey(
    'jwk',
    {
      crv: "P-384",
      ext: true,
      kty: "EC",
      ...signingKey, d: signingSecret },
    {
        name: 'ECDSA',
        namedCurve: "P-384",
    },
    true,
    ["sign"],
  );
}

export const importEncryptionKey = (jwk: string, key: JsonWebKey): Promise<CryptoKey> => {
  if (!jwk) {
      return;
  }
  
  delete key.key_ops;

  return crypto.subtle.importKey(
    'jwk',
    { ...key, d: jwk },
    {
        name: 'ECDH',
        namedCurve: "P-384",
    },
    true,
    ["deriveKey", "deriveBits"]
  );
}

export const verifySignature = (publicKey, signature, transaction): Promise<Boolean> =>
  crypto.subtle.verify(
      {
          name: "ECDSA",
          hash: {name: "SHA-384"},
      },
      publicKey,
      signature,
      transaction,
  );

  export const verifyEncryptionKey = (publicKey, signature, transaction) =>
  crypto.subtle.verify(
      {
          name: "ECDSA",
          hash: {name: "SHA-384"},
      },
      publicKey,
      signature,
      transaction,
  );
