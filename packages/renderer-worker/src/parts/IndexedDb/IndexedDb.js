// TODO high memory usage in idb because of transactionDoneMap

import * as ExtensionHostWorker from '../ExtensionHostWorker/ExtensionHostWorker.js'

export const saveValue = async (storeId, value) => {
  await ExtensionHostWorker.invoke('IndexedDb.saveValue', storeId, value)
}

export const getValues = async (storeId) => {
  return ExtensionHostWorker.invoke('IndexedDb.getValues', storeId)
}

export const getValuesByIndexName = async (storeId, indexName, only) => {
  return ExtensionHostWorker.invoke('IndexedDb.getValuesByIndexName', storeId, indexName, only)
}

export const addHandle = async (uri, handle) => {
  return ExtensionHostWorker.invoke('IndexedDb.addHandle', uri, handle)
}

export const getHandle = async (uri) => {
  return ExtensionHostWorker.invoke('IndexedDb.getHandle', uri)
}
