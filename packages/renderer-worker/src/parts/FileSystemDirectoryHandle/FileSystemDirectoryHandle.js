import * as Arrays from '../Arrays/Arrays.js'
import * as Assert from '../Assert/Assert.js'

export const getChildHandles = async (handle) => {
  Assert.object(handle)
  const handles = await Arrays.fromAsync(handle.values())
  return handles
}

export const getFileHandle = (handle, name) => {
  return handle.getFileHandle(name)
}
