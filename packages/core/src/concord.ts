import { add_transaction, Blockchain, TransactionBase } from './ledger';
import { exportIdentity, sign } from './identity';
import { hash_data } from './utils';

export default () => {
  const state = {
    ledger: null,
  };

  const events = {
    'load:ledger': [],
    'update:ledger': [],
    'unload:ledger': [],
    'create:transaction': [],
    'update:transaction': [],
    'delete:transaction': []
  };

  const addTransaction = async (
    type: string,
    action: string,
    transaction: Object,
    signingKey: CryptoKey
  ) => {
    if (!['create', 'update', 'delete'].includes(action)) {
      return;
    }

    const identity = await exportIdentity(signingKey);

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

    const signature = await sign(signingKey, data);

    state.ledger = await add_transaction({
      signature,
      ...signedTransaction
    }, state.ledger);

    events[`${action}:transaction`].forEach(({ action }) => action(signedTransaction));
    events['update:ledger'].forEach(({ action }) => action(state.ledger));
  }
  
  const load = async (ledger: Blockchain) =>  {
    events['load:ledger'].forEach(({ action }) => action(ledger));
    state.ledger = ledger;
  }
  
  const registerHooks = (eventsOpts: Object) => {
    Object.entries(eventsOpts).forEach(([key, value]) => {
      events[key] = value;
    });
  }

  const createRecord = async (type, data, signingKey) => {
    await addTransaction(type, 'create', data, signingKey);
  }
  const updateRecord = async (type, data, signingKey) => {
    await addTransaction(type, 'update', data, signingKey);
  }
  const deleteRecord = async (type, data, signingKey) => {
    await addTransaction(type, 'delete', data, signingKey);
  }
  
  return {
    load,
    registerHooks,

    createRecord,
    updateRecord,
    deleteRecord,
  }
}