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
    async invokeAndTransfer(method, ...params) {
      const ipc = await getOrCreate(fn)
      return JsonRpc.invokeAndTransfer(ipc, method, ...params)
    },
    async dispose() {
      const promise = workers.get(fn)
      workers.delete(fn)
      const ipc = await promise
      ipc.dispose()
    },
    async restart(terminateCommand) {
      const promise = workers.get(fn)
      workers.delete(fn)
      const ipc = await promise
      ipc.send({ jsonrpc: '2.0', method: terminateCommand, params: [] })
      ipc.dispose()
      await getOrCreate(fn)
    },
  }
}
