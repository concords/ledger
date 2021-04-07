export default (db) => {
  let collection;

  function createCollection({ ledger }) {
    collection = db.addCollection(ledger.id, { disableMeta: true });
  }

  return {
    getCollection: () => collection,
    plugin: {
      onLoad: createCollection,
      onDestroy({ ledger }) {
        db.removeCollection(ledger.id);
      },
      onAdd(record) {
        const item = collection.findOne({ id: record.data.id });
        if (item) {
          collection.update({ ...item, ...record.data, user: record.user });
        } else {
          collection.insert({ ...record.data, user: record.user });
        }
      },
    },
  };
};