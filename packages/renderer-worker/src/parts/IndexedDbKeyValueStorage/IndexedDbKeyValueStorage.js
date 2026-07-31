// TODO high memory usage in idb because of transactionDoneMap

import * as IndexedDb from '../IndexedDb/IndexedDb.js'

export const set = async (key, value) => {
  await IndexedDb.set(key, value)
}

export const get = async (key) => {
  return IndexedDb.get(key)
}
