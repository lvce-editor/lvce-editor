import * as Command from '../Command/Command.js'
import * as GetProtocol from '../GetProtocol/GetProtocol.js'
import { VError } from '../VError/VError.js'

const handles = Object.create(null)

const getLegacyHtmlKeys = (uri) => {
  if (!uri.startsWith('html://')) {
    return []
  }
  const protocol = GetProtocol.getProtocol(uri)
  const strippedUri = GetProtocol.getPath(protocol, uri)
  const legacyKeys = []
  if (strippedUri) {
    legacyKeys.push(strippedUri)
  }
  if (strippedUri.startsWith('/')) {
    legacyKeys.push(strippedUri.slice(1))
  }
  return legacyKeys.filter((value, index, array) => value && array.indexOf(value) === index)
}

export const addHandle = async (uri, handle) => {
  try {
    // TODO save handle in indexeddb
    handles[uri] = handle
    await Command.execute('IndexedDb.addHandle', uri, handle)
  } catch (error) {
    throw new VError(error, 'Failed to add handle')
  }
}

export const addHandles = async (parentUri, childHandles) => {
  const promises = []
  for (const childHandle of childHandles) {
    const childUri = parentUri + '/' + childHandle.name
    if (childUri in handles) {
      continue
    }
    handles[childUri] = childHandle
    promises.push(addHandle(childUri, childHandle))
  }
  await Promise.all(promises)
}

export const removeHandle = (uri) => {
  delete handles[uri]
  const prefix = `${uri}/`
  for (const key in handles) {
    if (key.startsWith(prefix)) {
      delete handles[key]
    }
  }
}

export const getHandle = async (uri) => {
  try {
    // TODO retrieve handle from state or from indexeddb
    // TODO if not found, throw error
    if (uri in handles) {
      return handles[uri]
    }
    let handle = await Command.execute('IndexedDb.getHandle', uri)
    if (!handle) {
      const legacyKeys = getLegacyHtmlKeys(uri)
      for (const legacyKey of legacyKeys) {
        handle = await Command.execute('IndexedDb.getHandle', legacyKey)
        if (handle) {
          await addHandle(uri, handle)
          handles[legacyKey] = handle
          break
        }
      }
    }
    if (handle) {
      handles[uri] = handle
    }
    return handle
  } catch (error) {
    throw new VError(error, 'Failed to get handle')
  }
}
