export const create = async (): Promise<Object> => {
  const signingKey = await crypto.subtle.generateKey(
    { name: "ECDSA", namedCurve: "P-384" },
    true,
    ["sign", "verify"]
  );

  const encryptionKey = await window.crypto.subtle.generateKey(
    {
      name: "ECDH",
      namedCurve: "P-384"
    },
    true,
    ["deriveKey"]
  );

  const publicSigningKey: JsonWebKey = await crypto.subtle.exportKey('jwk', signingKey.publicKey) as JsonWebKey;
  const privateSigningKey: JsonWebKey = await crypto.subtle.exportKey('jwk', signingKey.privateKey) as JsonWebKey;

  const publicEncryptionKey: JsonWebKey = await crypto.subtle.exportKey('jwk', encryptionKey.publicKey) as JsonWebKey;
  const privateEncryptionKey: JsonWebKey = await crypto.subtle.exportKey('jwk', encryptionKey.privateKey) as JsonWebKey;

  return {
    signingSecret: privateSigningKey.d,
    signingKey: publicSigningKey,
    encryptionKey: publicEncryptionKey,
    encryptionSecret: privateEncryptionKey.d,
  };
}

export const importSigningKey = (jwk: string, key: JsonWebKey): Promise<CryptoKey> => {
  if (!jwk) {
      return;
  }
  delete key.key_ops;

  return crypto.subtle.importKey(
    'jwk',
    { ...key, d: jwk },
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

export const verifySignature = (publicKey, signature, transaction) =>
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
