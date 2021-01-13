import { ref } from 'vue';
import { auth } from '@teamconcords/core';

const signingKey = ref(null);

async function getSigningKey(key, jwk) {
  if (key && jwk) {
    signingKey.value = await auth.login(jwk, key);
  } else {
    signingKey.value = false;
  }
}

export default () => ({
  signingKey,
  getSigningKey
});
