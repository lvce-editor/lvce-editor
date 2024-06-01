import * as FileSystemState from '../FileSystemState/FileSystemState.js'

// TODO when it rejects, it should throw a custom error,
// FileSystemError

// TODO lazyload different file system providers

// TODO extension host should be able to register arbitrary protocols (except app, http, https, file, )

export const getFileSystem = (protocol) => {
  const fn = FileSystemState.get(protocol)
  return fn()
}
