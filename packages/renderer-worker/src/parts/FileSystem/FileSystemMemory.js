import * as FileSystemWorker from '../FileSystemWorker/FileSystemWorker.js'

export const name = 'Memory'
export const readFile = (uri) => FileSystemWorker.invoke('FileSystem.readFile', uri)
export const exists = (uri) => FileSystemWorker.invoke('FileSystem.exists', uri)
export const writeFile = (uri, content) => FileSystemWorker.invoke('FileSystem.writeFile', uri, content)
export const createFile = (uri) => FileSystemWorker.invoke('FileSystem.createFile', uri)
export const mkdir = (uri) => FileSystemWorker.invoke('FileSystem.mkdir', uri)
export const isReadonly = () => false
export const remove = (uri) => FileSystemWorker.invoke('FileSystem.remove', uri)
export const readDirWithFileTypes = (uri) => FileSystemWorker.invoke('FileSystem.readDirWithFileTypes', uri)
export const getBlob = (uri) => FileSystemWorker.invoke('FileSystem.readFileAsBlob', uri)
export const getBlobUrl = async (uri) => URL.createObjectURL(await getBlob(uri))
export const chmod = () => {
  throw new Error('[memfs] chmod not implemented')
}
export const copy = (oldUri, newUri) => FileSystemWorker.invoke('FileSystem.copy', oldUri, newUri)
export const rename = (oldUri, newUri) => FileSystemWorker.invoke('FileSystem.rename', oldUri, newUri)
export const stat = (uri) => FileSystemWorker.invoke('FileSystem.stat', uri)
export const getFiles = () => FileSystemWorker.invoke('FileSystemMemory.getFiles')
