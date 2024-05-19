import * as Command from '../Command/Command.ts'
import { VError } from '../VError/VError.ts'

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

export const addHandles = async (parentUri, childHandles) => {
  const promises: any[] = []
  for (const childHandle of childHandles) {
    const childUri = parentUri + '/' + childHandle.name
    if (childUri in state.handles) {
      continue
    }
    state.handles[childUri] = childHandle
    promises.push(addHandle(childUri, childHandle))
  }
  await Promise.all(promises)
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
    throw new VError(error, 'Failed to get handle')
  }
}
