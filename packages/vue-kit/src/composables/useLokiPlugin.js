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
        // Bail if no data
        if (!record.data) {
          return;
        }

        const item = collection.findOne({ id: record.data.id });
        if (item) {
          collection.update({ ...item, ...record.data });
        } else {
          collection.insert(record.data);
        }
      },
    },
  };
};