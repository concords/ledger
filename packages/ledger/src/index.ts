import { add_transaction, create, hash_data } from '@concords/core';
import { exportIdentity, sign, importSigningKey } from '@concords/identity';

let hooks = {};

const availableHooks = [
  'loaded',
  'updated',
  'unloaded',
  'createRecord',
  'updateRecord',
  'deleteRecord',
];

async function runHooks(type, props) {
  let i = 0;
  let len = hooks[type].length;
  for (;i < len; i++) {
    await hooks[type][i](props)
  }
};

export default (config = {
  plugins: [],
  identity: null,
  secret: null
}) => {

  const state = {
    ledger: null,
    signingKey: null,
  };

  async function setSigningKey() {
    state.signingKey = await importSigningKey(config.identity, config.secret);
  }

  async function loadLedger(ledger) {
    await setSigningKey();
    state.ledger = ledger;
    runHooks('loaded', state);
  }
  
  async function createLedger() {
    await setSigningKey();
    state.ledger = await create({ signingKey: state.signingKey }, 2);
    runHooks('loaded', state);
  }

  hooks = availableHooks.reduce((acc, curr) => ({
    ...acc,
    [curr]: [],
  }), {});

  config.plugins.forEach((plugin) => {
    availableHooks.forEach((hook) => {
      if (plugin[hook]) {
        hooks[hook] = [ ...hooks[hook], plugin[hook] ];
      }
    });
  });

  const addTransaction = async (
    type,
    action,
    transaction,
  ) => {
    if (!state.signingKey) {
      console.warn('cannot add transaction: signing key not loaded');
      return;
    }
    
    if (!state.ledger) {
      console.warn('cannot add transaction: ledger not loaded');
      return;
    }

    if (!['create', 'update', 'delete'].includes(action)) {
      console.warn('cannot add transaction: action must be "create", "update" or "delete');
      return;
    }

    const identity = await exportIdentity(state.signingKey);

    const timestamp = Date.now();
    const id = await hash_data(`${JSON.stringify(identity)}_${timestamp}`);

    const data = {
        ...transaction,
    };

    if (!data.id) {
      data.id = await hash_data(`${JSON.stringify(data)}_${timestamp}`);
    }
    
    const signedTransaction = {
      type,
      action,
      data,
      id,
      timestamp,
      user: identity,
    }

    const signature = await sign(state.signingKey, data);
    
    state.ledger = await add_transaction({
      signature,
      ...signedTransaction
    }, { ...state.ledger });

    runHooks(`${action}Record`, signedTransaction);
    runHooks('updated', state);
  }

  const createRecord = async (type, data) => {
    await addTransaction(type, 'create', data);
  }
  const updateRecord = async (type, data) => {
    await addTransaction(type, 'update', data);
  }
  const deleteRecord = async (type, data) => {
    await addTransaction(type, 'delete', data);
  }
  
  return {
    createLedger,
    loadLedger,
    createRecord,
    updateRecord,
    deleteRecord,
  }
}