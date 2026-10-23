import * as FileSystemWorker from '../FileSystemWorker/FileSystemWorker.js'

export const exists = (uri) => FileSystemWorker.invoke('FileSystem.exists', uri)

export const readDirWithFileTypes = (uri) => FileSystemWorker.invoke('FileSystem.readDirWithFileTypes', uri)

export const readFile = (uri) => FileSystemWorker.invoke('FileSystem.readFile', uri)

export const writeFile = (uri, content) => FileSystemWorker.invoke('FileSystem.writeFile', uri, content)

export const writeBlob = (uri, blob) => FileSystemWorker.invoke('FileSystem.writeBlob', uri, blob)

export const remove = (uri) => FileSystemWorker.invoke('FileSystem.remove', uri)

export const mkdir = (uri) => FileSystemWorker.invoke('FileSystem.mkdir', uri)

export const isReadonly = (uri) => FileSystemWorker.invoke('FileSystem.isReadonly', uri)

export const getBlob = (uri) => FileSystemWorker.invoke('FileSystem.readFileAsBlob', uri)

// Keep URL lifetime with the renderer's existing blob URL consumers.
export const getBlobSrc = async (uri) => URL.createObjectURL(await getBlob(uri))

export const canBeRestored = true
