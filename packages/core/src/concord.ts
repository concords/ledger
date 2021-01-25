import hyperactiv from 'hyperactiv';
import { add_transaction, Blockchain, TransactionBase } from './ledger';
import { hash_data, signTransaction } from './utils';

const { observe } = hyperactiv;

const state = observe({
  ledger: {},
  loaded: false,
});

const events = {
  'load:ledger': (ledger) => {},
  'update:ledger': (ledger) => {},
  'unload:ledger': () => {},
  'create:transaction': (ledger) => {},
  'update:transaction': (ledger) => {},
  'delete:transaction': (ledger) => {},
};

const load = async (ledger: Blockchain) =>  {
  state.ledger = ledger;
  events['load:ledger'](ledger);
}

const registerEvents = (eventsOpts: Object) => {
  Object.entries(eventsOpts).forEach(([key, value]) => {
    events[key] = value;
  });
}

const addTransaction = async (
    type: string,
    action: string,
    transaction: Object,
    identity: JsonWebKey,
    signingKey: CryptoKey
  ) => {
    if (!['create', 'update', 'delete'].includes(action)) {
      return;
    }

    const timestamp = Date.now();
    const id = await hash_data(`${JSON.stringify(identity)}_${timestamp}`);

    const data: TransactionBase = {
        ...transaction,
        id,
        timestamp,
    };

    const signature = await signTransaction(signingKey, data);
    
    const signedTransaction = {
      type,
      action,
      data,
      user: identity,
      signature
    }

    state.ledger = await add_transaction(signedTransaction, state.ledger);
    events[`${action}:transaction`](signedTransaction);
    events['update:ledger'](state.ledger);

    return transaction;
}

export default () => {
  return {
    load,
    registerEvents,

    addTransaction,
  }
}