import { add_transaction, create, hash_data, mine } from '@concords/core';
import { exportIdentity, sign, importSigningKey } from '@concords/identity';

let hooks = {};

const availableHooks = [
  'onAuth',
  'onLoad',
  'onCreate',
  'onUpdate',
  'onUnload',
  'onReplay',
  'onCommit',
  'onAdd'
];

async function runHooks(type, props) {
  let i = 0;
  let len = hooks[type].length;
  for (;i < len; i++) {
    await hooks[type][i](JSON.parse(JSON.stringify(props)))
  }
};

export default (config = {
  plugins: [],
  identity: null,
  secret: null,
  ledger: null,
}) => {

  const state = {
    ledger: null,
    signingKey: null,
  };

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

  async function auth({ identity, secret }) {
    state.signingKey = await importSigningKey(identity, secret);
    runHooks('onAuth', identity);
  }

  async function create(ledger, difficulty = 1) {
    state.ledger = await create({}, difficulty);
    runHooks('onCreate', state);
  }
  
  async function load(ledger, shouldReplay = true) {
    state.ledger = ledger;
    runHooks('onLoad', state);
    if (shouldReplay) {
      replay();
    }
  }

  const add = async (transaction) => {
    if (!state.signingKey) {
      console.warn('Cannot add transaction: signingKey not verified');
      return;
    }
    
    if (!state.ledger) {
      console.warn('Cannot add transaction: ledger not loaded');
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

    runHooks('onAdd', signedTransaction);
    runHooks('onUpdate', state);
  }

  async function replay({ from = null, to = null } = {}) {
    if (!state.ledger) {
      console.warn('Cannot replay: ledger not loaded');
      return;
    }

    const { chain, pending_transactions } = state.ledger;
    const transactions = [
        ...chain.reduce((acc, block) => ([ ...acc, ...block.transactions ]), []),
        ...pending_transactions,
    ].sort((a, b) => a.timestamp - b.timestamp);

    let i = from ? 
      transactions.findIndex(({ id }) => id === from) :
      0;

    const len = to ? 
      transactions.findIndex(({ id }) => id === to) + 1 :
      transactions.length;  

    if (i < 0) {
      console.warn(`Cannot replay: transaction ${from} not found`);
      return;
    }
    for (; i < len; i++) {
      await runHooks('onAdd', transactions[i]);
    }
    runHooks('onReplay', { from, to });
  }

  async function commit() {
    state.ledger = await mine(state.ledger);
    runHooks('onCommit', state);
    runHooks('onUpdate', state);
  }
  
  return {
    auth,
    load,
    replay,
    commit,
    add,
  }
}