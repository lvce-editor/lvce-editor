import * as JsonRpc from '../JsonRpc/JsonRpc.js'

const workers = new Map()

const getOrCreate = (fn) => {
  if (!workers.has(fn)) {
    workers.set(fn, fn())
  }
  return workers.get(fn)
}

export const getOrCreateWorker = (fn) => {
  return {
    async invoke(method, ...params) {
      const ipc = await getOrCreate(fn)
      return JsonRpc.invoke(ipc, method, ...params)
    },
    async invokeAndTransfer(transfer, method, ...params) {
      const ipc = await getOrCreate(fn)
      return JsonRpc.invokeAndTransfer(ipc, transfer, method, ...params)
    },
    async dispose() {
      const promise = workers.get(fn)
      workers.delete(fn)
      const ipc = await promise
      ipc.dispose()
    },
  }
}
