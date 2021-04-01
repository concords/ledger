export default {
  loaded({ ledger }) {
    localStorage.setItem(ledger.id, JSON.stringify(ledger))
  },
  updated({ ledger }) {
    localStorage.setItem(ledger.id, JSON.stringify(ledger))
  }
}