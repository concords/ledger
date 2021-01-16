import { ref, watch, unref } from 'vue';
import { document } from '@teamconcords/core';

import useConcord from './useConcord';
import useAuthentication from './useAuthentication';

const { createConcord, concord, tree, closeConcord, commit } = useConcord();
const { storageCredentials, signingKey } = useAuthentication();

const log = ref([]);
const doc = ref({});
const isValid = ref(false);
const documents = ref([]);

watch(tree, async () => {
  if (tree.value) {
    isValid.value = await document.verify(unref(tree));
  }

  if (concord.value) {
    const { get, transactionLog } = unref(concord);
    log.value = await transactionLog();
    doc.value = (await get('document'))[0];
  }
})


const fetchDocument = async (url) => {
  // const { data } = await axios.get(url);
  // loadDocument(data);
}

const createDocument = async ({ name }) => {
  const tree = await document.create({
    name,
    creator_key: storageCredentials.key,
    signingKey: unref(signingKey),
  }, 1);

  sessionStorage.setItem('active-doc', tree.id);

  createConcord(
    storageCredentials.key,
    signingKey,
    tree,
    [],
    () => {}
  );

  setDocuments();
}

const loadDocument = async (tree) => {
  sessionStorage.setItem('active-doc', tree.id);

  createConcord(
    storageCredentials.key,
    signingKey,
    tree,
    [],
    () => {}
  );

  setDocuments();
}

const setDocuments = () => {
  documents.value = Object.keys(sessionStorage).filter((val) => val !== 'active-doc').map((val) => JSON.parse(sessionStorage.getItem(val)))
}

export default () => ({
  document: doc,
  documents,
  isValid,
  commit,
  createDocument,
  loadDocument,
  fetchDocument,
  closeDocument: closeConcord,
  setDocuments,
});
