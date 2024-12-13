// TODO high memory usage in idb because of transactionDoneMap

import * as ExtensionHostWorker from '../ExtensionHostWorker/ExtensionHostWorker.js'

export const set = async (key, value) => {
  await ExtensionHostWorker.invoke('IndexedDb.set', key, value)
}

export const get = async (key) => {
  return ExtensionHostWorker.invoke('IndexedDb.get', key)
}
