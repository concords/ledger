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
export const createIdentity = async (): Promise<IAuthKeys> => {
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
 * Export Identity from signing key
 *
 * ```typescript
 * const user: Identity = await exportIdentity(signingKey);
 * 
 * const uniquePublicIdentifier = `${user.x}${user.y}`;
 * ```
 */
export const exportIdentity = async (
  signingKey: CryptoKey,
): Promise<IIdentity> => {
  const publicSigningKey: JsonWebKey
    = await crypto.subtle.exportKey('jwk', signingKey) as JsonWebKey;

  return { x: publicSigningKey.x, y: publicSigningKey.y };
}


/**
 * Sign JSON object with signing key
 *
 * ```typescript
 * const signature: string = await sign(signingKey, data);
 * ```
 */
export const sign = async (
  signingKey: CryptoKey,
  data: Object
) : Promise<string> => {
  
  const dataBuffer = new TextEncoder().encode(JSON.stringify(data));
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
  
  const u8 = new Uint8Array(signatureBuffer);
  return btoa(String.fromCharCode.apply(null, u8));
};


/**
 * Verify signature on JSON object
 *
 * ```typescript
 * const isSignatureValid: Boolean = await verifySignature(identity, signature, data);
 * ```
 */
export const verifySignature = async (
  identity: IIdentity,
  signature: string,
  data: Object
): Promise<Boolean> => {
  const key = await crypto.subtle.importKey(
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
    ["sign"],
  );

  const u8data = new TextEncoder().encode(JSON.stringify(data));
  const u8signature = new Uint8Array(atob(signature).split('').map((c) => c.charCodeAt(0)));

  return crypto.subtle.verify(
    {
      name: "ECDSA",
      hash: { name: "SHA-256" },
    },
    key,
    u8signature,
    u8data,
  );
}