const rpc = globalThis.lvceRpc({
  getCount() {
    return 123
  },
  setCount(count) {
    document.body.textContent = count
  },
})
