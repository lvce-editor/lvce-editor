import * as FileSystemHandle from './FileSystemHandle.js'
import * as GetFilePathElectron from '../GetFilePathElectron/GetFilePathElectron.js'

export const name = 'FileSystemHandle'

export const Commands = {
  addFileHandle: FileSystemHandle.addFileHandle,
  getFileHandles: FileSystemHandle.getFileHandles,
  getFilePathElectron: GetFilePathElectron.getFilePathElectron,
}
