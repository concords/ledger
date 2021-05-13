/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
function __awaiter(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
}

function b64encode(buf) {
  return btoa(String.fromCharCode.apply(null, new Uint8Array(buf)));
}
function b64decode(str) {
  var binary_string = window.atob(str);
  var len = binary_string.length;
  var bytes = new Uint8Array(new ArrayBuffer(len));

  for (var i = 0; i < len; i++) {
    bytes[i] = binary_string.charCodeAt(i);
  }

  return bytes;
}
function spkiToPEM(key) {
  var keydataS = arrayBufferToString(key);
  var keydataB64 = window.btoa(keydataS);
  var keydataB64Pem = formatAsPem(keydataB64);
  return keydataB64Pem;
}
function arrayBufferToString(buffer) {
  var binary = '';
  var bytes = new Uint8Array(buffer);
  var len = bytes.byteLength;

  for (var i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }

  return binary;
}
function formatAsPem(str) {
  var finalString = '-----BEGIN PUBLIC KEY-----\n';

  while (str.length > 0) {
    finalString += str.substring(0, 64) + '\n';
    str = str.substring(64);
  }

  finalString = finalString + "-----END PUBLIC KEY-----";
  return finalString;
}

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

const generate = () => __awaiter(void 0, void 0, void 0, function* () {
  const {
    publicKey,
    privateKey
  } = yield crypto.subtle.generateKey({
    name: "ECDSA",
    namedCurve: "P-256"
  }, true, ["sign", "verify"]);
  const publicSigningKey = yield crypto.subtle.exportKey('jwk', publicKey);
  const privateSigningKey = yield crypto.subtle.exportKey('jwk', privateKey);
  return {
    secret: privateSigningKey.d,
    identity: {
      x: publicSigningKey.x,
      y: publicSigningKey.y
    }
  };
});
/**
 * Import Signing Key from public key
 *
 * ```typescript
 * const signingKey: CryptoKey = await importSigningKey(identity, secret);
 * ```
 */

const importSigningKey = (identity, secret) => {
  if (!identity || !secret) {
    return;
  }

  return crypto.subtle.importKey('jwk', Object.assign(Object.assign({
    crv: "P-256",
    ext: true,
    kty: "EC"
  }, identity), {
    d: secret
  }), {
    name: 'ECDSA',
    namedCurve: "P-256"
  }, true, ["sign"]);
};
/**
 * Import Signing Key from public key
 *
 * ```typescript
 * const signingKey: CryptoKey = await importSigningKey(identity, secret);
 * ```
 */

const importPublicKey = identity => {
  if (!identity) {
    return;
  }

  return crypto.subtle.importKey('jwk', Object.assign({
    crv: "P-256",
    ext: true,
    kty: "EC"
  }, identity), {
    name: 'ECDSA',
    namedCurve: "P-256"
  }, true, ["verify"]);
};
/**
 * Export Identity from signing key
 *
 * ```typescript
 * const user: Identity = await exportIdentity(signingKey);
 *
 * const uniquePublicIdentifier = `${user.x}${user.y}`;
 * ```
 */

function exportSigningKey(signingKey) {
  return __awaiter(this, void 0, void 0, function* () {
    const publicSigningKey = yield crypto.subtle.exportKey('jwk', signingKey);
    return {
      x: publicSigningKey.x,
      y: publicSigningKey.y
    };
  });
}
/**
 * Export public key as der
 *
 * ```typescript
 * const b64der: string = await exportPublicKeyAsDer(publicKey);
 * ```
 */

function exportPublicKey(key) {
  return __awaiter(this, void 0, void 0, function* () {
    const exported = yield window.crypto.subtle.exportKey("spki", key);
    return b64encode(exported);
  });
}
/**
 * Export public key as der
 *
 * ```typescript
 * const b64der: string = await exportPublicKeyAsDer(publicKey);
 * ```
 */

function publicKeyFromDer(key) {
  return __awaiter(this, void 0, void 0, function* () {
    const exported = yield window.crypto.subtle.exportKey("spki", key);
    return spkiToPEM(exported);
  });
}
const sign = (identity, secret, data) => __awaiter(void 0, void 0, void 0, function* () {
  const signingKey = yield importSigningKey(identity, secret);
  const dataBuffer = new TextEncoder().encode(JSON.stringify(data));
  const signatureBuffer = yield crypto.subtle.sign({
    name: "ECDSA",
    hash: {
      name: "SHA-256"
    }
  }, signingKey, dataBuffer);
  return b64encode(signatureBuffer);
});
/**
 * Verify signature on JSON object
 *
 * ```typescript
 * const isSignatureValid: Boolean = await verifySignature(identity, signature, data);
 * ```
 */

const verify = (identity, signature, data) => __awaiter(void 0, void 0, void 0, function* () {
  const key = yield importPublicKey(identity);
  const dataBuffer = new TextEncoder().encode(JSON.stringify(data));
  return crypto.subtle.verify({
    name: "ECDSA",
    hash: {
      name: "SHA-256"
    }
  }, key, b64decode(signature), dataBuffer);
});

export { exportPublicKey, exportSigningKey, generate, importPublicKey, importSigningKey, publicKeyFromDer, sign, verify };
