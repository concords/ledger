import { encode } from './utils';

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
 *   secret: string,
 * } = await create();
 * ```
 */
export const create = async (): Promise<AuthKeys> => {
  const { publicKey, privateKey} = await crypto.subtle.generateKey(
    { name: "ECDSA", namedCurve: "P-384" },
    true,
    ["sign", "verify"]
  );

  const publicSigningKey: JsonWebKey
    = await crypto.subtle.exportKey('jwk', publicKey) as JsonWebKey;
  
    const privateSigningKey: JsonWebKey
    = await crypto.subtle.exportKey('jwk', privateKey) as JsonWebKey;

  return {
    secret: privateSigningKey.d,
    identity: { x: publicSigningKey.x, y: publicSigningKey.y },
  };
}

/**
 * Import Signing Key
 *
 * ```typescript
 * const signingKey: CryptoKey = await importSigningKey(identity, secret);
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
 * Export Identity
 *
 * ```typescript
 * const signingKey: CryptoKey = await importSigningKey(identity, secret);
 * ```
 */
export const exportIdentity = async (
  signingKey: CryptoKey,
): Promise<Identity> => {
  const publicSigningKey: JsonWebKey
    = await crypto.subtle.exportKey('jwk', signingKey) as JsonWebKey;

  return { x: publicSigningKey.x, y: publicSigningKey.y };
}


/**
 * Sign
 *
 * ```typescript
 * const signature: string = await sign(signingKey, data);
 * ```
 */
export const sign = async (
  signingKey: CryptoKey,
  data: Object
) : Promise<string> => {
  
  const dataBuffer = await encode(data);
  const signatureBuffer = await crypto.subtle.sign(
      {
          name: "ECDSA",
          hash: {
              name: "SHA-384"
          },
      },
      signingKey,
      dataBuffer,
  );
  
  const u8 = new Uint8Array(signatureBuffer);
  return btoa(String.fromCharCode.apply(null, u8));
};


/**
 * Verify signature
 *
 * ```typescript
 * const isSignatureValid: Boolean = await verifySignature(identity, signature, data);
 * ```
 */
export const verifySignature = async (
    identity: Identity,
    signature: string,
    data: Object
  ): Promise<Boolean> => {
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