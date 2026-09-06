import * as ExtensionManagementWorker from '../ExtensionManagementWorker/ExtensionManagementWorker.js'
import * as FileSystem from '../FileSystem/FileSystem.js'
import * as Memory from '../FileSystem/FileSystemMemory.js'

const memoryRoot = (id: string): string => `memfs:///applications/${encodeURIComponent(id)}`
const memoryUri = (id: string, uri: string): string => `${memoryRoot(id)}/${uri.slice('memfs://'.length).replace(/^\/+/, '')}`

const providerMethods: Readonly<Record<string, string>> = {
  isReadonly: 'IsReadonly',
  mkdir: 'Mkdir',
  readDirWithFileTypes: 'ReadDirWithFileTypes',
  readFile: 'ReadFile',
  remove: 'Remove',
  rename: 'Rename',
  writeFile: 'WriteFile',
}

// Memory storage and extension providers are owned by the application. Only
// immutable HTTP assets use the shared filesystem; never fall back to another
// application's provider when a scheme is unknown.
export const execute = async (id: string, method: string, ...args: readonly any[]): Promise<any> => {
  const [uri] = args
  if (typeof uri !== 'string') {
    throw new TypeError('Application filesystem requires a URI')
  }
  if (method === 'readJson') {
    return JSON.parse(await execute(id, 'readFile', ...args))
  }
  if (uri.startsWith('untitled:') && method === 'readFile') {
    return ''
  }
  if (uri.startsWith('memfs://')) {
    const fn = Memory[method]
    if (typeof fn !== 'function') {
      throw new Error(`Unsupported application memory operation: ${method}`)
    }
    const mapped = [...args]
    mapped[0] = memoryUri(id, uri)
    if (method === 'rename' || method === 'copy') {
      if (!args[1].startsWith('memfs://')) {
        throw new Error('Cross-filesystem operation is not supported')
      }
      mapped[1] = memoryUri(id, args[1])
    }
    return fn(...mapped)
  }
  if (/^https?:/.test(uri) && (method === 'readFile' || method === 'getBlob')) {
    return FileSystem[method](...args)
  }
  const suffix = providerMethods[method]
  if (!suffix) {
    throw new Error(`Unsupported application filesystem operation: ${method}`)
  }
  const scheme = uri.slice(0, uri.indexOf(':'))
  const { found, result } = await ExtensionManagementWorker.invoke(
    'Extensions.invokeForApplication',
    id,
    `Extensions.executeFileSystemProvider${suffix}`,
    scheme,
    ...(method === 'isReadonly' ? [] : args),
  )
  if (!found) {
    throw new Error(`No ${scheme} filesystem provider in application ${id}`)
  }
  return result instanceof Blob ? result.text() : result
}

export const dispose = (id: string): void => Memory.remove(memoryRoot(id))
