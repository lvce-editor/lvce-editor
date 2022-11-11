import * as FileHandle from './PersistentFileHandle.js'

export const name = 'PersistentFileHandle'

export const Commands = {
  addHandle: FileHandle.addHandle,
  getHandle: FileHandle.getHandle,
  removeHandle: FileHandle.removeHandle,
}
