import hyperactiv from 'hyperactiv';
import { createDb, createDbApi, ActionsKeys, Actions } from '../data';
import { add_transaction, Blockchain, Block, Transaction, TransactionBase, mine } from '../blockchain';
import { hash_data } from '../utils';
import { sign } from '../identity';

const { observe, computed, watch } = hyperactiv;

interface TransactionSync {
    hasRan: boolean;
    transaction: Transaction;
}

const getNewTransactions = async (blockchain: Blockchain, transactionLog: Array<string> = []):Promise<Array<TransactionSync>> => {
    const { chain, pending_transactions } = blockchain;
    const transactions = [
        ...chain.reduce((acc, block) => ([ ...acc, ...block.transactions ]), []),
        ...pending_transactions,
    ];

    const transactionPromises = transactions.map(async (transaction: Transaction):Promise<TransactionSync> => {
        return new Promise(async (resolve) => {
            const hash = await hash_data(transaction);
            const hasRan = transactionLog.includes(hash);
            resolve({ hasRan, transaction });
        })
    });

    const transactionsToRun = await Promise.all(transactionPromises);
    return transactionsToRun.filter((run: TransactionSync) => !run.hasRan);
}

const syncDb = async (transactions: Array<TransactionSync> = [], dbApi: Actions, transactionLog: Array<string> = []) => {
    const newTransactions:Array<string> = [];
    const hashPromise = transactions.map(async ({ transaction }: TransactionSync) => {
        const { action, type, data } = transaction;
        const actionKey:ActionsKeys = action as ActionsKeys;
        await dbApi[actionKey](type, data);
        const hash = await hash_data(transaction);
        newTransactions.push(hash);

        return new Promise(async (resolve) => resolve(null));
    });
    await Promise.all(hashPromise);
    await dbApi.update('key_store', [...transactionLog, ...newTransactions], 'transaction_log');
}

export const createApi = () => ({
    create: async (type: string, obj: TransactionBase, blockchain: Blockchain, user: Object, jwk: CryptoKey) => {
        const timestamp = Date.now();
        const id = await hash_data(`${obj.id}_${timestamp}`);

        const data: TransactionBase = {
            ...obj,
            id,
            timestamp,
        };

        const signature = await sign(jwk, data);
        return add_transaction({ type, action: 'create', data, user, signature }, blockchain);
    },
    update: async (type: string, obj: TransactionBase, blockchain: Blockchain, user: Object, jwk: CryptoKey) => {
        const timestamp = Date.now();

        const data: TransactionBase = {
            ...obj,
            timestamp,
        };

        const signature = await sign(jwk, data);
        return add_transaction({ type, action: 'update', data, user, signature }, blockchain);
    },
    delete: async (type: string, obj: TransactionBase, blockchain: Blockchain, user: Object, jwk: CryptoKey) => {
        const timestamp = Date.now();

        const data: TransactionBase = {
            ...obj,
            timestamp,
        };

        const signature = await sign(jwk, data);
        return add_transaction({ type, action: 'delete', data, user, signature }, blockchain);
    },
});

interface Concord {};

const observed = observe({
    ledger: null,
    events: {},
});

export const load = async (
        ledger: Blockchain
    ) =>  {
        observed.ledger = ledger;
        observed.events['load:ledger'](ledger);

        watch(observed.ledger, (oldLedger, newLedger) => {
            observed.events['update:ledger'](oldLedger, newLedger);
        });
    }

export const registerEvents = ({ events }) => {
    observed.events = Object.entries(events).reduce((acc, [key, event]) => ({
        ...acc,
        [key]: event
    }), {});
}

export const start = async (user: Object, signingKey: CryptoKey, blockchain: Blockchain, objectStores: Array<string>, watch: Function) => {
    const db = await createDb(blockchain.id, 1,
        objectStores.map((name) => ({ name, config: { keyPath: 'id' }})));

    const dbApi = await createDbApi(db);
    const api = await createApi();
    const observed = observe({ blockchain });
    computed(async () => {
        const { blockchain } = observed;

        if (!blockchain) {
            return;
        }

        let cleanBlockchain = JSON.parse(JSON.stringify(blockchain));

        await dbApi.update('key_store', cleanBlockchain, 'blockchain');

        const transactionLog = await dbApi.get('key_store', {}, 'transaction_log');
        const transactions = await getNewTransactions(cleanBlockchain, transactionLog || []);

        await syncDb(transactions, dbApi, transactionLog || []);

        // set a dirty flag for external reactivity;
        watch(cleanBlockchain);
    });

    return {
        create: async (type: string, obj: TransactionBase) => {
            observed.blockchain = await api.create(type, obj, observed.blockchain, user, signingKey);
        },
        update: async (type: string, obj: TransactionBase) => {
            observed.blockchain = await api.update(type, obj, observed.blockchain, user, signingKey);
        },
        delete: async (type: string, obj: TransactionBase) => {
            observed.blockchain = await api.delete(type, obj, observed.blockchain, user, signingKey);
        },
        get: dbApi.get,
        transactionLog: async () => {
            const { chain, pending_transactions } = observed.blockchain;
            return [
                ...chain.reduce((acc: Array<Block>, curr: Block) => ([
                    ...acc,
                    ...curr.transactions,
                ]), []),
                ...pending_transactions.map((trans) => ({ ...trans, pending: true })),
            ];
        },
        commit: async () => {
            observed.blockchain = await mine(observed.blockchain);
        },
        pendingTransactions: () => observed.blockchain.pending_transactions,
        close: async () =>  {
            await db.close();
            var req = indexedDB.deleteDatabase(observed.blockchain.id);
            req.onsuccess = function () {
                console.log('DB dropped')
            };
            req.onerror = function () {
                console.log("Couldn't delete database");
            };
            req.onblocked = function () {
                console.log("Couldn't delete database due to the operation being blocked");
            };
        },
    };
}

