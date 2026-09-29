import * as ExtensionManagementWorker from '../ExtensionManagementWorker/ExtensionManagementWorker.js'
import * as FileSystem from '../FileSystem/FileSystem.js'
import * as FileSystemWorker from '../FileSystemWorker/FileSystemWorker.js'

const providerMethods: Readonly<Record<string, string>> = {
  isReadonly: 'IsReadonly',
  mkdir: 'Mkdir',
  readDirWithFileTypes: 'ReadDirWithFileTypes',
  readFile: 'ReadFile',
  remove: 'Remove',
  rename: 'Rename',
  writeFile: 'WriteFile',
}

const getFileHashes = async (id: string, uris: readonly string[]): Promise<readonly (string | null)[]> => {
  if (!Array.isArray(uris)) {
    throw new TypeError('uris must be an array')
  }
  for (const uri of uris) {
    if (typeof uri !== 'string') {
      throw new TypeError('Application filesystem requires a URI')
    }
  }
  const hashes: Array<string | null> = Array.from({ length: uris.length }, () => null)
  let nextIndex = 0
  const hashNext = async (): Promise<void> => {
    while (nextIndex < uris.length) {
      const index = nextIndex++
      try {
        const content = await execute(id, 'readFile', uris[index])
        const bytes = new TextEncoder().encode(content)
        const digest = await crypto.subtle.digest('SHA-256', bytes)
        hashes[index] = Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('')
      } catch {
        // An unreadable file is a cache miss, without failing the other hashes.
        hashes[index] = null
      }
    }
  }
  await Promise.all(Array.from({ length: Math.min(32, uris.length) }, hashNext))
  return hashes
}

// Memory storage and extension providers are owned by the application. Only
// immutable HTTP assets use the shared filesystem; never fall back to another
// application's provider when a scheme is unknown.
export const execute = async (id: string, method: string, ...args: readonly any[]): Promise<any> => {
  if (method === 'getFileHashes') {
    return getFileHashes(id, args[0])
  }
  const [uri] = args
  if (typeof uri !== 'string') {
    throw new TypeError('Application filesystem requires a URI')
  }
  if (method === 'readJson') {
    return JSON.parse(await execute(id, 'readFile', ...args))
  }
  if (uri.startsWith('live-component-state:')) {
    const ComponentStateFileSystem = await import('../ApplicationComponentStateFileSystem/ApplicationComponentStateFileSystem.ts')
    return ComponentStateFileSystem.execute(id, method, uri, ...args.slice(1))
  }
  if (uri.startsWith('untitled:') && method === 'readFile') {
    return ''
  }
  if (uri.startsWith('memfs://')) {
    return FileSystemWorker.invoke('ApplicationFileSystem.execute', id, method, ...args)
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

export const dispose = async (id: string): Promise<void> => {
  await FileSystemWorker.invoke('ApplicationFileSystem.dispose', id)
}
