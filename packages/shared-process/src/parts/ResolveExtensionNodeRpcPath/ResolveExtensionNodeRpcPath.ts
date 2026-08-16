import { readFile, realpath } from 'node:fs/promises'
import path from 'node:path'

const idRegex = /^[A-Za-z0-9][A-Za-z0-9._-]*$/
const schemeRegex = /^[A-Za-z][A-Za-z\d+.-]*:/

const isInside = (parent: string, child: string): boolean => child === parent || child.startsWith(`${parent}${path.sep}`)

const validateId = (value: string, name: string): void => {
  if (!idRegex.test(value)) {
    throw new Error(`Invalid extension node rpc ${name}`)
  }
}

export const resolveExtensionNodeRpcPath = async (extensionId: string, rpcId: string): Promise<string> => {
  validateId(extensionId, 'extension id')
  validateId(rpcId, 'rpc id')
  const configuredRoot = process.env.LVCE_REMOTE_EXTENSIONS_PATH
  if (!configuredRoot) {
    throw new Error('Remote extensions path is unavailable')
  }
  const extensionsRoot = await realpath(configuredRoot)
  const extensionRoot = await realpath(path.join(extensionsRoot, extensionId))
  if (!isInside(extensionsRoot, extensionRoot)) {
    throw new Error('Extension path escapes the remote extensions root')
  }
  const manifest = JSON.parse(await readFile(path.join(extensionRoot, 'extension.json'), 'utf8'))
  const rpc = manifest.rpc?.find((candidate: any) => candidate?.id === rpcId)
  if (!rpc || rpc.type !== 'node' || typeof rpc.url !== 'string') {
    throw new Error(`Node rpc ${rpcId} is not declared by extension ${extensionId}`)
  }
  if (!rpc.url || path.isAbsolute(rpc.url) || schemeRegex.test(rpc.url)) {
    throw new Error(`Node rpc ${rpcId} must use a relative url`)
  }
  const modulePath = await realpath(path.resolve(extensionRoot, rpc.url))
  if (!isInside(extensionRoot, modulePath)) {
    throw new Error('Extension node rpc path escapes the extension root')
  }
  return modulePath
}
