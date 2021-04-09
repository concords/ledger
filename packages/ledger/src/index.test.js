import ledger from '../dist/concords-ledger.esm'

describe('Test Ledger', () => {
  let rawLedger = null;

  const ledgerApi = ledger({
    plugins: [
      {
        onAuth() {},
        onLoad() {},
        onReady({ ledger }) {
          rawLedger = ledger;
        },
        onUpdate() {},
        onUnload() {},
        onReplay() {},
        onCommit() {},
        onAdd() {},
        onDestroy() {},
      }
    ],
  });

  it('Returns the Ledger API', () => {
    expect(Object.keys(ledgerApi)).toStrictEqual([
      "auth",
      "load",
      "create",
      "replay",
      "commit",
      "add",
      "destroy",
    ]);
  });
  
  it('Creates a new ledger', async () => {
    await ledgerApi.create({ id: 'test' });
    expect(rawLedger.chain.length).toBe(1);
    expect(rawLedger.chain[0].records.length).toBe(1);
    expect(rawLedger.chain[0].records[0].data.id).toBe('test');
  });
});
