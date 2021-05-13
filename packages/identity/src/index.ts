import { b64encode, b64decode, spkiToPEM } from './utils';

export interface IIdentity {
  x: string,
  y: string,
}
export interface IAuthKeys {
  secret: string,
  identity: IIdentity,
};

/**
 * Create a new Identity key-pair
 *
 * ```typescript
 * const {
 *   identity: Identity,
 *   secret: string,
 * } = await createIdentity();
 * ```
 */
export const generate = async (): Promise<IAuthKeys> => {
  const { publicKey, privateKey} = await crypto.subtle.generateKey(
    { name: "ECDSA", namedCurve: "P-256" },
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
 * Import Signing Key from public key
 *
 * ```typescript
 * const signingKey: CryptoKey = await importSigningKey(identity, secret);
 * ```
 */
export const importSigningKey = (
  identity: IIdentity,
  secret: string
): Promise<CryptoKey> => {
  
  if (!identity || !secret) {
    return;
  }

  return crypto.subtle.importKey(
    'jwk',
    {
      crv: "P-256",
      ext: true,
      kty: "EC",
      ...identity, d: secret },
    {
        name: 'ECDSA',
        namedCurve: "P-256",
    },
    true,
    ["sign"],
  );
}
/**
 * Import Signing Key from public key
 *
 * ```typescript
 * const signingKey: CryptoKey = await importSigningKey(identity, secret);
 * ```
 */
export const importPublicKey = (
  identity: IIdentity,
): Promise<CryptoKey> => {
  
  if (!identity) {
    return;
  }

  return crypto.subtle.importKey(
    'jwk',
    {
      crv: "P-256",
      ext: true,
      kty: "EC",
      ...identity
    },
    {
      name: 'ECDSA',
      namedCurve: "P-256",
    },
    true,
    ["verify"],
  );
}

/**
 * Export Identity from signing key
 *
 * ```typescript
 * const user: Identity = await exportIdentity(signingKey);
 * 
 * const uniquePublicIdentifier = `${user.x}${user.y}`;
 * ```
 */
export async function exportSigningKey(
  signingKey: CryptoKey,
): Promise<IIdentity> {
  const publicSigningKey: JsonWebKey
    = await crypto.subtle.exportKey('jwk', signingKey) as JsonWebKey;

  return { x: publicSigningKey.x, y: publicSigningKey.y };
}


/**
 * Export public key as der
 *
 * ```typescript
 * const b64der: string = await exportPublicKeyAsDer(publicKey);
 * ```
 */
 export async function exportPublicKey(key) {
  const exported = await window.crypto.subtle.exportKey(
    "spki",
    key
  );
  return b64encode(exported);
}

/**
 * Export public key as der
 *
 * ```typescript
 * const b64der: string = await exportPublicKeyAsDer(publicKey);
 * ```
 */
export async function publicKeyFromDer(key) {
  const exported = await window.crypto.subtle.exportKey(
    "spki",
    key
  );
  return spkiToPEM(exported);
}




export const sign = async (
  identity: IIdentity,
  secret: string,
  data: Object
) : Promise<string> => {
  const signingKey = await importSigningKey(identity, secret);
  const dataBuffer = new TextEncoder().encode(JSON.stringify(data))
  const signatureBuffer = await crypto.subtle.sign(
    {
      name: "ECDSA",
      hash: {
        name: "SHA-256"
      },
    },
    signingKey,
    dataBuffer,
  );
  
  return b64encode(signatureBuffer);
};


/**
 * Verify signature on JSON object
 *
 * ```typescript
 * const isSignatureValid: Boolean = await verifySignature(identity, signature, data);
 * ```
 */
export const verify = async (
  identity: IIdentity,
  signature: string,
  data: Object
): Promise<Boolean> => {
  const key = await importPublicKey(identity);
  const dataBuffer = new TextEncoder().encode(JSON.stringify(data));

  return crypto.subtle.verify(
    {
      name: "ECDSA",
      hash: { name: "SHA-256" },
    },
    key,
    b64decode(signature),
    dataBuffer,
  );
}

