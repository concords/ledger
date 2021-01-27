
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
