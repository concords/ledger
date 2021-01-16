import { watch, ref } from 'vue';
import useStorageCredentials from './useStorageCredentials';
import useSigningKey from './useSigningKey';
import useEncryptionKey from './useEncryptionKey';
import { auth } from '@teamconcords/core';

const { storageCredentials, setStorageCredentials, getStorageCredentials } = useStorageCredentials();
const { signingKey, setSigningKey } = useSigningKey();
const { encryptionKey, setEncryptionKey } = useEncryptionKey();

const isAuthenticated = ref(null);

watch(storageCredentials, ({
  signingKey, signingSecret, encryptionKey, encryptionSecret
}) => {
  setSigningKey(signingKey, signingSecret);
  setEncryptionKey(encryptionKey, encryptionSecret);
});

watch(signingKey, (newSigningKey = {}) => {
  isAuthenticated.value = newSigningKey.type === 'private';
});

const login = async (signingKey, signingSecret) => {
  setStorageCredentials(signingKey, signingSecret);
}

const logout = async () =>
  setStorageCredentials(null, null, null, null);

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
    signingKey,
    encryptionKey
  }
}
