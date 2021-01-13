import { watch, ref } from 'vue';
import useStorageCredentials from './useStorageCredentials';
import useSigningKey from './useSigningKey';
import { auth } from '@teamconcords/core';

const { storageCredentials, setStorageCredentials, getStorageCredentials } = useStorageCredentials();
const { signingKey, getSigningKey } = useSigningKey();

const isAuthenticated = ref(null);

watch(storageCredentials, ({ signingKey, signingSecret }) => getSigningKey(signingKey, signingSecret));
watch(signingKey, (newSigningKey = {}) => {
  isAuthenticated.value = newSigningKey.type === 'private';
});

const login = async (signingKey, signingSecret) => {
  setStorageCredentials(signingKey, signingSecret);
}

const logout = async () => setStorageCredentials(storageCredentials.signingKey, null, null, null);

const createUser = async () => {
  const { signingKey, signingSecret, encryptionKey, encryptionSecret } = await auth.create();
  setStorageCredentials(signingKey, signingSecret, encryptionKey, encryptionSecret);
}

export default () => {
  return {
    login,
    logout,
    create: createUser,
    sessionLogin: getStorageCredentials,

    storageCredentials,
    isAuthenticated,
    signingKey
  }
}
