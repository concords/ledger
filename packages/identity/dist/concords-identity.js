var Identity = (function (exports) {
    'use strict';

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

    const createIdentity = () => __awaiter(void 0, void 0, void 0, function* () {
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
     * Export Identity from signing key
     *
     * ```typescript
     * const user: Identity = await exportIdentity(signingKey);
     *
     * const uniquePublicIdentifier = `${user.x}${user.y}`;
     * ```
     */

    const exportIdentity = signingKey => __awaiter(void 0, void 0, void 0, function* () {
      const publicSigningKey = yield crypto.subtle.exportKey('jwk', signingKey);
      return {
        x: publicSigningKey.x,
        y: publicSigningKey.y
      };
    });
    /**
     * Sign JSON object with signing key
     *
     * ```typescript
     * const signature: string = await sign(signingKey, data);
     * ```
     */

    const sign = (signingKey, data) => __awaiter(void 0, void 0, void 0, function* () {
      const dataBuffer = new TextEncoder().encode(JSON.stringify(data));
      const signatureBuffer = yield crypto.subtle.sign({
        name: "ECDSA",
        hash: {
          name: "SHA-256"
        }
      }, signingKey, dataBuffer);
      const u8 = new Uint8Array(signatureBuffer);
      return btoa(String.fromCharCode.apply(null, u8));
    });
    /**
     * Verify signature on JSON object
     *
     * ```typescript
     * const isSignatureValid: Boolean = await verifySignature(identity, signature, data);
     * ```
     */

    const verifySignature = (identity, signature, data) => __awaiter(void 0, void 0, void 0, function* () {
      const key = yield crypto.subtle.importKey('jwk', Object.assign({
        crv: "P-256",
        ext: true,
        kty: "EC"
      }, identity), {
        name: 'ECDSA',
        namedCurve: "P-256"
      }, true, ["sign"]);
      const u8data = new TextEncoder().encode(JSON.stringify(data));
      const u8signature = new Uint8Array(atob(signature).split('').map(c => c.charCodeAt(0)));
      return crypto.subtle.verify({
        name: "ECDSA",
        hash: {
          name: "SHA-256"
        }
      }, key, u8signature, u8data);
    });

    exports.createIdentity = createIdentity;
    exports.exportIdentity = exportIdentity;
    exports.importSigningKey = importSigningKey;
    exports.sign = sign;
    exports.verifySignature = verifySignature;

    Object.defineProperty(exports, '__esModule', { value: true });

    return exports;

}({}));
