import * as Command from '../Command/Command.js'
import { VError } from '../VError/VError.js'

export const state = {
  handles: Object.create(null),
}

export const addHandle = async (uri, handle) => {
  try {
    // TODO save handle in indexeddb
    state.handles[uri] = handle
    await Command.execute('IndexedDb.addHandle', uri, handle)
  } catch (error) {
    throw new VError(error, 'Failed to add handle')
  }
}

export const removeHandle = () => {
  // TODO remove handle from state and from indexeddb
}

export const getHandle = async (uri) => {
  try {
    // TODO retrieve handle from state or from indexeddb
    // TODO if not found, throw error
    const handle = await Command.execute('IndexedDb.getHandle', uri)
    return handle
  } catch (error) {
    throw new VError(error, `Failed to get handle`)
  }
}
