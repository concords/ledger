import { ref } from 'vue';
import { auth } from '@teamconcords/core';

const encryptionKey = ref(null);

async function setEncryptionKey(key, jwk) {
  if (key && jwk) {
    encryptionKey.value = await auth.importEncryptionKey(jwk, key);
  } else {
    encryptionKey.value = false;
  }
}

export default () => ({
  encryptionKey,
  setEncryptionKey
});
