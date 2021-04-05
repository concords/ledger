import { add_transaction, create, hash_data, mine } from '@concords/core';
import { exportIdentity, sign, importSigningKey } from '@concords/identity';

let hooks = {};

const availableHooks = [
  'onAuth',
  'onLoad',
  'onUpdate',
  'onUnload',
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

  async function load(ledger, difficulty = 1, shouldReplay = true) {
    state.ledger = ledger || await create({}, difficulty);
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

  async function replay() {
    if (!state.ledger) {
      return;
    }

    const { chain, pending_transactions } = state.ledger;
    const transactions = [
        ...chain.reduce((acc, block) => ([ ...acc, ...block.transactions ]), []),
        ...pending_transactions,
    ];

    for (let i = 0; i < transactions.length; i++) {
      await runHooks('onAdd', transactions[i]);
    }
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