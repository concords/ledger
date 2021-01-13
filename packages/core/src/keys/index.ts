
export const encode = (data: string): Uint16Array =>
    new Uint16Array(new TextEncoder().encode(data));

export const decode = (data: Uint16Array): string =>
    new TextDecoder().decode(new Uint16Array(data));

export const generateKey = (): PromiseLike<CryptoKeyPair> =>
    crypto.subtle.generateKey(
        {
            name: "ECDSA",
            namedCurve: "P-384", //can be "P-256", "P-384", or "P-521"
        },
        true,
        ["sign", "verify"]
    );

export const encrypt = async (key: CryptoKey, data: Uint16Array, additionalData: Uint16Array) =>
    crypto.subtle.encrypt(
        {
            name: 'AES-GSM',
            length: 256,
            iv: window.crypto.getRandomValues(new Uint8Array(12)),
            additionalData,
        },
        key,
        data,
    );


export const decrypt = async (key: CryptoKey, data: Uint8Array) =>
    crypto.subtle.decrypt(
        {
            name: "AES-GCM",
            length: 256
        },
        key,
        data,
    );

export const importKey = (key: JsonWebKey, key_ops: Array<KeyUsage>): PromiseLike<CryptoKey> =>
    crypto.subtle.importKey(
        'jwk',
        key,
        {
            name: 'ECDSA',
            namedCurve: "P-384",
        },
        true,
        key_ops,
    );

export const exportKey = (type: KeyFormat, publicKey: CryptoKey): PromiseLike<JsonWebKey | ArrayBuffer> =>
    crypto.subtle.exportKey(type, publicKey);


export const deriveSecretKey = (privateKey: CryptoKey, publicKey: CryptoKey) =>
    window.crypto.subtle.deriveKey(
        {
        name: "ECDH",
        public: publicKey
        },
        privateKey,
        {
        name: "AES-GCM",
        length: 256
        },
        false,
        ["encrypt", "decrypt"]
    );
