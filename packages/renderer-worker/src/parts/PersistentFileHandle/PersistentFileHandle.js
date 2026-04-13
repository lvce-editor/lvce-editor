import * as Command from '../Command/Command.js'
import { VError } from '../VError/VError.js'

const handles = Object.create(null)

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
    const handle = await Command.execute('IndexedDb.getHandle', uri)
    if (handle) {
      handles[uri] = handle
    }
    return handle
  } catch (error) {
    throw new VError(error, 'Failed to get handle')
  }
}
