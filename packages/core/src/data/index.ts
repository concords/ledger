import { openDB, IDBPDatabase } from 'idb';
import { TransactionBase } from '../blockchain';

export interface Actions {
    create(type: string, obj: Object, id?: string): Promise<any>;
    get(type: string, obj?: Object, id?: string): Promise<any>;
    update(type: string, obj: Object, id?: string): Promise<any>;
    delete(type: string, obj: TransactionBase): Promise<any>;
}
export type ActionsKeys = keyof Actions;

export const createDb = async (name: string, version: number, objectStores: Array<{ name: string, config?: { keyPath: string } }>) =>
    openDB(name, version, {
        upgrade(db: { createObjectStore: Function }) {
            [{ name: 'key_store' }, ...objectStores]
                .forEach(({ name, config }) => db.createObjectStore(name, config))
        },
        blocked() {
            console.log('blocked');
        },
        blocking() {
            console.log('blocking');
        },
        terminated() {
            console.log('terminated');
        },
    });

export const createDbApi = (db: IDBPDatabase): Actions => ({
    create: (type: string, obj: Object): Promise<any> => {
        try {
            return db.add(type, obj);
        } catch (e) {
            console.error('Create Error:', e);
        }
    },
    update: async (type: string, obj: Object, id?: string): Promise<any> => {
        try {
            if (id) {
                const obj1 = await db.get(type, id);
                return db.put(type, obj, id);
            }
            return db.put(type, obj);
        } catch (e) {
            console.error('Update Error:', e);
        }
    },
    delete: async (type: string, obj: TransactionBase): Promise<any> => {
        try {
            return db.delete(type, obj.id);
        } catch (e) {
            console.error('Delete Error:', e);
        }
    },
    get: (type: string, obj: Object, id?: string): Promise<any> =>
        id ? db.get(type, id) : db.getAll(type, id),
});

export const deleteDb = (name: string) => indexedDB.deleteDatabase(name)
