import { hash_data } from './utils';

export interface TransactionBase {
    id: string;
    timestamp: number;
}

export interface Transaction {
    action: string,
    type: string,
    data: TransactionBase,
    signature: Object,
    user: Object,
};

export interface TransactionHash {
    hash: String,
    transaction: Transaction,
};

export interface Block {
    transactions: Array<Transaction>,
    timestamp: number,
    previous_hash: string,
    hash: string,
    nonce: number,
}
export interface Blockchain {
    chain: Array<Block>,
    pending_transactions: Array<Transaction>,
    difficulty: number,
    id: string,
}

async function proof_of_work(block: Block, difficulty: number) {
    const find_hash = async (block: Block): Promise<string> => {
        let hash = await hash_data(block);
        if (hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
            const nonce = block.nonce + 1;
            hash = await find_hash({
                ...block,
                nonce,
            });
        }
        return hash;
    };
    const hash = await find_hash({ nonce: 0, ...block });
    return hash;
};

async function is_valid_proof(block: Block, hash: string, difficulty: number): Promise<Boolean> {
    const block_hash = await hash_data(block);
    return (
        hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")
        && hash === block_hash
    );
};


export function add_transaction(transaction: Transaction, blockchain: Blockchain): Blockchain {

    return {
        ...blockchain,
        pending_transactions: Array.from(new Set([...blockchain.pending_transactions, transaction])),
    };
}


export async function mine(blockchain: Blockchain): Promise<Blockchain> {
    if (!blockchain.pending_transactions.length) {
        return blockchain;
    }

    const last_block = blockchain.chain[blockchain.chain.length - 1];

    const new_block = create_block(blockchain.pending_transactions, last_block.hash);
    const proof = await proof_of_work(new_block, blockchain.difficulty);
    const mined = await add_block(blockchain, new_block, proof);

    return {
        ...mined,
        pending_transactions: []
    }
}

function is_chain_valid(chain: Array<Block>) {
    for (let i = 1; i < chain.length; i++) {
        const current_block = chain[i];
        const previous_block = chain[i - 1];

        if (current_block.previous_hash !== previous_block.hash) {
            return false;
        }
    }
    return true;
};

async function add_block(
    blockchain: Blockchain,
    block: Block,
    proof: string): Promise<Blockchain> {
        const last_block = blockchain.chain[blockchain.chain.length - 1];

        if (last_block.hash !== block.previous_hash) {
            return blockchain;
        }

        if (!is_valid_proof(block, proof, blockchain.difficulty)) {
            return blockchain;
        }

        return {
            ...blockchain,
            chain: [
                ...blockchain.chain,
                {
                    ...block,
                    hash: proof,
                },
            ],
            pending_transactions: [...blockchain.pending_transactions],
        };
};


function create_block(
    transactions: Array<Transaction> = [],
    previous_hash: string = '0'
    ): Block {
        return {
            transactions,
            timestamp: Date.now(),
            previous_hash,
            hash: '0',
            nonce: 0,
        }
};


function create_blockchain(
  difficulty: number = 1,
  pending_transactions: Array<Transaction> = [],
  chain: Array<Block> = []
): Blockchain {

  return {
    difficulty,
    pending_transactions: [...pending_transactions],
    chain: [...chain],
    id: '',
  };
};

async function create_genesis_block(data): Promise<Block> {

    const timestamp = Date.now();
    const id = await hash_data(`${JSON.stringify(data.creator_key)}_${timestamp}`);

    const genesis_block = create_block();
    const hash = await hash_data({ timestamp, id});

    return {
        ...genesis_block,
        hash,
    };
}

export async function create(genesis_data: Object, difficulty: number): Promise<Blockchain> {
    const blockchain = create_blockchain(difficulty);
    const genesis_block = await create_genesis_block(genesis_data);
    blockchain.id = genesis_block.hash;
    blockchain.chain.push(genesis_block);
    return blockchain;
};

export function consensus(blockchains: Array<Blockchain>): Blockchain {
    let longestChain: Blockchain = blockchains[0];

    blockchains.forEach((blockchain) => {
        if (!is_chain_valid(blockchain.chain)) {
            return;
        };
        if (blockchain.chain.length > longestChain.chain.length) {
            longestChain = blockchain;
        }
    });

    return longestChain;
}