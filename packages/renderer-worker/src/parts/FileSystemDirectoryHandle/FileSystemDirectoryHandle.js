import * as Arrays from '../Arrays/Arrays.js'
import * as Assert from '../Assert/Assert.js'
import { VError } from '../VError/VError.js'

/**
 *
 * @param {FileSystemDirectoryHandle} handle
 * @returns {Promise<FileSystemHandle[]>}
 */
export const getChildHandles = async (handle) => {
  try {
    Assert.object(handle)
    // @ts-ignore
    const handles = await Arrays.fromAsync(handle.values())
    return handles
  } catch (error) {
    throw new VError(error, `Failed to read directory`)
  }
}

/**
 *
 * @param {FileSystemDirectoryHandle} handle
 * @param {string} name
 * @returns
 */
export const getFileHandle = (handle, name) => {
  return handle.getFileHandle(name)
}
