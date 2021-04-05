import { ref } from 'vue';
import { auth } from '@teamconcords/core';

const signingKey = ref(null);

async function setSigningKey(key, jwk) {
  if (key && jwk) {
    signingKey.value = await auth.importSigningKey(jwk, key);
  } else {
    signingKey.value = false;
  }
}

export default () => ({
  signingKey,
  setSigningKey
});
