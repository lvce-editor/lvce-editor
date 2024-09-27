import * as FileSystemState from '../FileSystemState/FileSystemState.js'

// TODO when it rejects, it should throw a custom error,
// FileSystemError

// TODO lazyload different file system providers

// TODO extension host should be able to register arbitrary protocols (except app, http, https, file, )

export const getFileSystem = (protocol) => {
  const fn = FileSystemState.get(protocol)
  if (!fn) {
    throw new Error(`file system for protocol ${protocol} not found`)
  }
  if (typeof fn !== 'function') {
    throw new Error(`invalid file system provider for protocol ${protocol}`)
  }
  return fn()
}
