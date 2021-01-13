import { ref, unref } from 'vue';
import { document } from '@teamconcords/core';

const concord = ref(null);
const tree = ref(null);
const isCommiting = ref(false);
const isLoading = ref(false);
const canCommit = ref(false);

const reactiveCallback = async (newTree) => {
  const { get, pendingTransactions } = unref(concord);
  const doc = await get('document');

  canCommit.value = !!pendingTransactions().length;

  sessionStorage.setItem(newTree.id, JSON.stringify({
    tree: newTree,
    id: newTree.id,
    info: doc[0],
  }));
  tree.value = unref(newTree);
}

const createConcord = async (
  key,
  signingKey,
  tree,
  objectStores,
) => {
  isLoading.value = true;
  concord.value = await document.load(
    unref(key),
    unref(signingKey),
    unref(tree),
    [...objectStores, 'owner', 'document'],
    reactiveCallback,
  );
  isLoading.value = false;
}

const closeConcord = () => {
  concord.value = null;
  tree.value = null;
}

const commit = async () => {
  isCommiting.value = true;
  const { commit } = unref(concord);

  await commit();

  isCommiting.value = false;
  canCommit.value = false;
}

export default () => ({
  concord,
  tree,
  isCommiting,
  isLoading,
  canCommit,
  commit,
  createConcord,
  closeConcord,
});
