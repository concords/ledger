import { add_transaction, create, TransactionBase } from './blockchain';
import { exportIdentity, sign, importSigningKey } from './identity';
import { hash_data } from './utils';

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
  ledger: null,
  identity: null,
  secret: null
}) => {

  const state = {
    ledger: config.ledger,
    signingKey: null,
  };

  async function setSigningKey() {
    state.signingKey = await importSigningKey(config.identity, config.secret);
  }

  async function loadLedger() {
    await setSigningKey();
    state.ledger = await create({ signingKey: state.signingKey }, 2);

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
    type: string,
    action: string,
    transaction: Object,
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

    const data: TransactionBase = {
        ...transaction,
        id,
        timestamp,
    };
    
    const signedTransaction = {
      type,
      action,
      data,
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

  if (state.ledger) {
    loadLedger();
  } else {
    createLedger();
  }
  
  return {
    createRecord,
    updateRecord,
    deleteRecord,
  }
}