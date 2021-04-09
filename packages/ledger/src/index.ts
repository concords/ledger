import { addRecord, createLedger, mine, hashData, ILedger } from '@concords/core';
import { exportIdentity, sign, importSigningKey, IIdentity, IAuthKeys } from '@concords/identity';

export interface IConfig {
  plugins: Array<Object>,
  identity: IIdentity,
  secret: string,
  ledger: ILedger,
}

export interface IAuthFunc {
  (IAuthKeys): Promise<void>;
}

export interface ICreateFunc {
  (
    initialData?: Object,
    difficulty?: number,
  ): Promise<void>;
}
export interface ILoadFunc {
  (
    ledger: ILedger,
    shouldReplay?: boolean
  ): Promise<void>;
}
export interface IReplayFunc {
  (
    from?: string,
    to?: string
  ): Promise<void>;
}
export interface ICommitFunc {
  (): Promise<void>;
}
export interface IAddFunc {
  (data: Object): Promise<void>;
}
export interface IDestroyFunc {
  (data: Object): Promise<void>;
}

export interface ILedgerAPI {
  auth: IAuthFunc,
  create: ICreateFunc,
  load: ILoadFunc,
  replay: IReplayFunc,
  commit: ICommitFunc,
  add: IAddFunc,
  destroy: IDestroyFunc,
}

const availableHooks = [
  'onAuth',
  'onLoad',
  'onReady',
  'onUpdate',
  'onUnload',
  'onReplay',
  'onCommit',
  'onAdd',
  'onDestroy'
];

export default (
  config: IConfig = {
    plugins: [],
    identity: null,
    secret: null,
    ledger: null,
  }
): ILedgerAPI => {

  const state = {
    ledger: null,
    signingKey: null,
  };

  let hooks = availableHooks.reduce((acc, curr) => ({
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

  async function runHooks(type, props) {
    let i = 0;
    let len = hooks[type].length;
    for (;i < len; i++) {
      await hooks[type][i](JSON.parse(JSON.stringify(props)))
    }
  };

  async function auth({ identity, secret }) {
    state.signingKey = await importSigningKey(identity, secret);
    await runHooks('onAuth', identity);
  }

  async function create(
    data?: Object,
    difficulty: number = 1
  ) {
    const timestamp = Date.now();
    const identity = await exportIdentity(state.signingKey);
    const id = await hashData(`${JSON.stringify(identity)}_${timestamp}`);
    
    const record = {
      data,
      id,
      timestamp,
      identity,
    }

    const signature = await sign(state.signingKey, record);
    
    const signedRecord = {
      signature,
      ...record
    };
    state.ledger = await createLedger(signedRecord, difficulty);
    await runHooks('onLoad', state);
    await runHooks('onReady', state);
  }
  
  async function load(ledger, shouldReplay = true) {
    state.ledger = ledger;
    await runHooks('onLoad', state);
    if (shouldReplay) {
      await replay();
    }
    await runHooks('onReady', state);
  }

  const add = async (data) => {
    if (!state.signingKey) {
      console.warn('Cannot add record: signingKey not verified');
      return;
    }
    
    if (!state.ledger) {
      console.warn('Cannot add record: ledger not loaded');
      return;
    }

    const identity = await exportIdentity(state.signingKey);

    const timestamp = Date.now();
    const id = await hashData(`${JSON.stringify(identity)}_${timestamp}`);
    
    const record = {
      data,
      id,
      timestamp,
      identity,
    }

    const signature = await sign(state.signingKey, record);
    
    const signedRecord = {
      signature,
      ...record
    };

    state.ledger = await addRecord(signedRecord, { ...state.ledger });

    await runHooks('onAdd', signedRecord);
    await runHooks('onUpdate', state);
  }

  async function replay(from?, to?) {
    if (!state.ledger) {
      console.warn('Cannot replay: ledger not loaded');
      return;
    }

    const { chain, pending_records } = state.ledger;
    const records = [
        ...chain.reduce((acc, block) => ([ ...acc, ...block.records ]), []),
        ...pending_records,
    ].sort((a, b) => a.timestamp - b.timestamp);

    let i = from ? 
      records.findIndex(({ id }) => id === from) :
      0;

    const len = to ? 
      records.findIndex(({ id }) => id === to) + 1 :
      records.length;  

    if (i < 0) {
      console.warn(`Cannot replay: transaction ${from} not found`);
      return;
    }
    for (; i < len; i++) {
      await runHooks('onAdd', records[i]);
    }
    await runHooks('onReplay', { from, to, ...state });
  }

  async function destroy() {
    await runHooks('onDestroy', state);
  }

  async function commit() {
    state.ledger = await mine(state.ledger);
    await runHooks('onCommit', state);
    await runHooks('onUpdate', state);
  }

  if (config.secret && config.identity) {
    auth(config);
    if (config.ledger) {
      load(config.ledger);
    }
  }
  
  return {
    auth,
    load,
    create,
    replay,
    commit,
    add,
    destroy,
  }
}