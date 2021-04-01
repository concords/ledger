import { openDB } from 'idb';

export const createDb = async (name: string, version: number, objectStores: Array<{ name: string, config?: { keyPath: string } }>) =>
  openDB(name, version, {
      upgrade(db: { createObjectStore: Function }) {
          [{ name: 'key_store' }, ...objectStores]
              .forEach(({ name, config }) => db.createObjectStore(name, config))
      },
  });

export default (stores = []) => {
  let db = null;

  return {
    async loaded({ ledger }) {
      db = await createDb(ledger.id, 1,
        stores.map((name) => ({ name, config: { keyPath: 'id' }})));
    },
    unloaded({ ledger }) {
      return indexedDB.deleteDatabase(ledger.id)
    },
    updateRecord({ type, data }) {
      return db.put(type, data, data.id);
    },
    createRecord({ type, data }) {
      return db.add(type, data);
    },
    deleteRecord({ type, data }) {
      return db.delete(type, data.id);
    },
  }
}