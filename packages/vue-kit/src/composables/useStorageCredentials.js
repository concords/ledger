import { reactive, watch } from 'vue';

const storageCredentials = reactive({
  signingKey: null,
  signingSecret: null,
  encryptionKey: null,
  encryptionSecret: null
});

watch(storageCredentials, ({ signingKey, signingSecret, encryptionKey, encryptionSecret }) => {
  localStorage.setItem('signingKey', JSON.stringify(signingKey));
  localStorage.setItem('signingSecret', JSON.stringify(signingSecret));
  localStorage.setItem('encryptionKey', JSON.stringify(encryptionKey));
  localStorage.setItem('encryptionSecret', JSON.stringify(encryptionSecret));
})

function setStorageCredentials(signingKey, signingSecret, encryptionKey, encryptionSecret) {
  storageCredentials.signingKey = signingKey;
  storageCredentials.signingSecret = signingSecret;
  storageCredentials.encryptionKey = encryptionKey;
  storageCredentials.encryptionSecret = encryptionSecret;
}

function getStorageCredentials() {
  storageCredentials.signingKey = JSON.parse(localStorage.getItem('signingKey'));
  storageCredentials.signingSecret = JSON.parse(localStorage.getItem('signingSecret'));
  storageCredentials.encryptionKey = JSON.parse(localStorage.getItem('encryptionKey'));
  storageCredentials.encryptionSecret = JSON.parse(localStorage.getItem('encryptionSecret'));
}

export default () => {
  return {
    getStorageCredentials,
    setStorageCredentials,
    storageCredentials
  };
}
