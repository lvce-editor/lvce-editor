import { readFile, realpath } from 'node:fs/promises'
import path from 'node:path'
import * as ExtensionManagement from '../ExtensionManagement/ExtensionManagement.ts'

const idRegex = /^[A-Za-z0-9][A-Za-z0-9._-]*$/
const schemeRegex = /^[A-Za-z][A-Za-z\d+.-]*:/

const isInside = (parent: string, child: string): boolean => child === parent || child.startsWith(`${parent}${path.sep}`)

const validateId = (value: string, name: string): void => {
  if (!idRegex.test(value)) {
    throw new Error(`Invalid extension node process ${name}`)
  }
}

const getExtension = async (extensionId: string): Promise<any> => {
  const extensions = await ExtensionManagement.getExtensions()
  const extension = extensions.find((candidate: any) => candidate?.id === extensionId)
  if (!extension || typeof extension.path !== 'string') {
    throw new Error(`Extension ${extensionId} is not installed`)
  }
  return extension
}

export interface ExtensionNodeProcessInfo {
  readonly name: string
  readonly path: string
}

export const resolveExtensionNodeProcess = async (extensionId: string, rpcId: string): Promise<ExtensionNodeProcessInfo> => {
  validateId(extensionId, 'extension id')
  validateId(rpcId, 'rpc id')
  const extension = await getExtension(extensionId)
  const extensionRoot = await realpath(extension.path)
  const manifestPath = await realpath(path.join(extensionRoot, 'extension.json'))
  if (!isInside(extensionRoot, manifestPath)) {
    throw new Error('Extension manifest escapes the extension root')
  }
  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'))
  const rpc = manifest.rpc?.find((candidate: any) => candidate?.id === rpcId)
  if (!rpc || rpc.type !== 'node-process' || typeof rpc.url !== 'string') {
    throw new Error(`Node process ${rpcId} is not declared by extension ${extensionId}`)
  }
  if (!rpc.url || path.isAbsolute(rpc.url) || path.win32.isAbsolute(rpc.url) || schemeRegex.test(rpc.url)) {
    throw new Error(`Node process ${rpcId} must use a relative url`)
  }
  const processPath = await realpath(path.resolve(extensionRoot, rpc.url))
  if (!isInside(extensionRoot, processPath)) {
    throw new Error('Extension node process path escapes the extension root')
  }
  return {
    name: `Extension ${extensionId}: ${typeof rpc.name === 'string' && rpc.name ? rpc.name : rpcId}`,
    path: processPath,
  }
}
