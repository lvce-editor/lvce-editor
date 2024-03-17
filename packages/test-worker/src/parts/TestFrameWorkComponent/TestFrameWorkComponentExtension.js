import * as Rpc from '../Rpc/Rpc.js'

export const addWebExtension = async (relativePath) => {
  // TODO compute absolutePath
  const absolutePath = relativePath
  await Rpc.invoke('ExtensionMeta.addWebExtension', absolutePath)
}

export const addNodeExtension = async (relativePath) => {
  // TODO compute absolutePath
  const absolutePath = relativePath
  await Rpc.invoke('ExtensionMeta.addNodeExtension', absolutePath)
}
