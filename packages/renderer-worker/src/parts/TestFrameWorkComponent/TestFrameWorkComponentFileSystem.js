import * as Command from '../Command/Command.js'

export const writeFile = async (path, content) => {
  await Command.execute('FileSystem.writeFile', path, content)
}

export const mkdir = async (path) => {
  await Command.execute('FileSystem.mkdir', path)
}

export const getTmpDir = async () => {
  return `memfs://`
}
