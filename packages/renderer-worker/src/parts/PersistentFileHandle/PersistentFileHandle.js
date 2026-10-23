import * as FileSystemWorker from '../FileSystemWorker/FileSystemWorker.js'

export const addHandle = (uri, handle) => FileSystemWorker.invoke('PersistentFileHandle.addHandle', uri, handle)

export const getHandle = (uri) => FileSystemWorker.invoke('PersistentFileHandle.getHandle', uri)

export const removeHandle = (uri) => FileSystemWorker.invoke('PersistentFileHandle.removeHandle', uri)
