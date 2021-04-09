import { hashData } from './utils';
import { IIdentity } from '@concords/identity/types';

export * from './utils';

export interface IRecord {
  id: string,
  timestamp: number;
  signature: string,
  identity: IIdentity,
  data?: Object,
};

export interface IBlock {
  records: Array<IRecord>,
  timestamp: number,
  last_hash: string,
  hash: string,
}

export interface ILedger {
  chain: Array<IBlock>,
  pending_records: Array<IRecord>,
  difficulty: number,
  id: string,
}

async function proofOfWork(
  block: IBlock,
  difficulty: number
) {
  const findHash = async (block): Promise<string> => {
    let hash = await hashData(block);
    if (hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')) {
      const nonce = block.nonce + 1;
      hash = await findHash({
        ...block,
        nonce,
      });
    }
    return hash;
  };
  const hash = await findHash({ nonce: 0, ...block });
  return hash;
};

async function isValidProof(
  block: IBlock,
  hash: string,
  difficulty: number
): Promise<Boolean> {
  const blockHash = await hashData(block);
  return (
    hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")
    && hash === blockHash
  );
};


export function addRecord(
  record: IRecord,
  ledger: ILedger
): ILedger {
  return {
    ...ledger,
    pending_records: Array.from(new Set([...ledger.pending_records, record])),
  };
}


export async function mine(
  ledger: ILedger
): Promise<ILedger> {
  if (!ledger.pending_records.length) {
    return ledger;
  }
  const lastBlock = ledger.chain[ledger.chain.length - 1];

  const newBlock = createBlock(ledger.pending_records, lastBlock.hash);
  const proof = await proofOfWork(newBlock, ledger.difficulty);
  const mined = await addBlock(ledger, newBlock, proof);

  return {
    ...mined,
    pending_records: []
  }
}

function isChainValid(
  chain: Array<IBlock>
) {
  for (let i = 1; i < chain.length; i++) {
    const currentBlock = chain[i];
    const previousBlock = chain[i - 1];

    if (currentBlock.last_hash !== previousBlock.hash) {
      return false;
    }
  }
  return true;
};

async function addBlock(
  ledger: ILedger,
  block: IBlock,
  proof: string
): Promise<ILedger> {
  const lastBlock = ledger.chain[ledger.chain.length - 1];

  if (lastBlock.hash !== block.last_hash) {
    return ledger;
  }

  if (!isValidProof(block, proof, ledger.difficulty)) {
    return ledger;
  }

  return {
    ...ledger,
    chain: [
      ...ledger.chain,
      {
        ...block,
        hash: proof,
      },
    ],
    pending_records: [...ledger.pending_records],
  };
};


function createBlock(
  records: Array<IRecord|any> = [],
  last_hash: string = '0'
): IBlock {
    return {
      records,
      timestamp: Date.now(),
      last_hash,
      hash: '0'
    }
};


async function createGenesisBlock(
  data?: Object
): Promise<IBlock> {
  const timestamp = Date.now();
  const block = createBlock([data]);
  const hash = await hashData({ data, timestamp });

  return {
    ...block,
    hash,
  };
}

export function consensus(
  ledgers: Array<ILedger>
): ILedger {
  let longest: ILedger = ledgers[0];

  ledgers.forEach((ledger) => {
    if (!isChainValid(ledger.chain)) {
      return;
    };
    if (ledger.chain.length > longest.chain.length) {
      longest = ledger;
    }
  });

  return longest;
}

export async function createLedger(
  data: Object,
  difficulty: number
): Promise<ILedger> {
  const genesisBlock = await createGenesisBlock(data);

  return {
    difficulty,
    pending_records: [],
    chain: [genesisBlock],
    id: genesisBlock.hash,
  };
};