import * as FileHandle from './PersistentFileHandle.js'

export const Commands = {
  'PersistentFileHandle.addHandle': FileHandle.addHandle,
  'PersistentFileHandle.getHandle': FileHandle.getHandle,
  'PersistentFileHandle.removeHandle': FileHandle.removeHandle,
}
