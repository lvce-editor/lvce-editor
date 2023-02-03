import * as Arrays from '../Arrays/Arrays.js'
import * as Assert from '../Assert/Assert.js'

/**
 *
 * @param {FileSystemDirectoryHandle} handle
 * @returns {Promise<FileSystemHandle[]>}
 */
export const getChildHandles = async (handle) => {
  Assert.object(handle)
  // @ts-ignore
  const handles = await Arrays.fromAsync(handle.values())
  return handles
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
