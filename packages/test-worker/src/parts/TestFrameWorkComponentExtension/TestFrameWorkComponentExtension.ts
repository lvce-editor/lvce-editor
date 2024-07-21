import * as Rpc from '../Rpc/Rpc.ts'

export const addWebExtension = async (relativePath: string) => {
  // TODO compute absolutePath
  const absolutePath = relativePath
  await Rpc.invoke('ExtensionMeta.addWebExtension', absolutePath)
}

export const addNodeExtension = async (relativePath: string) => {
  // TODO compute absolutePath
  const absolutePath = relativePath
  await Rpc.invoke('ExtensionMeta.addNodeExtension', absolutePath)
}
