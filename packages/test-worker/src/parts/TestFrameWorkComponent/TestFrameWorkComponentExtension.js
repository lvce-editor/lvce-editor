import * as Command from '../Command/Command.js'

export const addWebExtension = async (relativePath) => {
  // TODO compute absolutePath
  const absolutePath = relativePath
  await Command.execute('ExtensionMeta.addWebExtension', absolutePath)
}

export const addNodeExtension = async (relativePath) => {
  // TODO compute absolutePath
  const absolutePath = relativePath
  await Command.execute('ExtensionMeta.addNodeExtension', absolutePath)
}
