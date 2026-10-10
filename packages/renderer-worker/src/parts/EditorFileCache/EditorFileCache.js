import * as ApplicationFileSystem from '../ApplicationFileSystem/ApplicationFileSystem.ts'
import * as CacheWorker from '../CacheWorker/CacheWorker.js'
import * as FileSystem from '../FileSystem/FileSystem.js'

const cacheName = 'editor-file-cache'
const maxBytes = 500_000
const expiresIn = 90 * 24 * 60 * 60 * 1000
const writeQueues = new Map()
const writeVersions = new Map()

const getKey = (applicationId, uri) => {
  const identity = encodeURIComponent(JSON.stringify([applicationId, uri]))
  return `https://lvce-editor.invalid/editor-file-cache/${identity}`
}

const getFingerprint = (stat) => {
  if (!stat || typeof stat !== 'object' || !Number.isFinite(stat.size)) {
    return ''
  }
  const modifiedTime = stat.mtimeMs ?? stat.mtime
  if (typeof modifiedTime !== 'number' && typeof modifiedTime !== 'string') {
    return ''
  }
  const fingerprint = [stat.type, stat.size, modifiedTime]
  const changedTime = stat.ctimeMs ?? stat.ctime
  if (typeof changedTime === 'number' || typeof changedTime === 'string') {
    fingerprint.push(changedTime)
  }
  if (typeof stat.etag === 'string') {
    fingerprint.push(stat.etag)
  }
  return JSON.stringify(fingerprint)
}

const getStat = (applicationId, uri) =>
  applicationId ? ApplicationFileSystem.execute(applicationId, 'statWithMetadata', uri) : FileSystem.statWithMetadata(uri)

const isExcluded = (uri) => {
  const path = uri.split(/[?#]/, 1)[0]
  const fileName = path.slice(path.lastIndexOf('/') + 1)
  return fileName === '.env' || fileName.startsWith('.env.')
}

export const get = async (applicationId, uri, fingerprint) => {
  if (isExcluded(uri)) {
    return null
  }
  const key = getKey(applicationId, uri)
  await writeQueues.get(key)?.catch(() => {})
  const item = await CacheWorker.invoke('Cache.getCacheStorageItem', key, cacheName)
  if (!item || item.headers['x-lvce-editor-file-stat'] !== fingerprint) {
    return null
  }
  const expires = Date.parse(item.headers.expires || '')
  if (!Number.isFinite(expires) || expires <= Date.now()) {
    void CacheWorker.invoke('Cache.removeCacheStorageItem', key, cacheName).catch(() => {})
    return null
  }
  return new TextDecoder().decode(item.body)
}

export const remove = async (applicationId, uri) => {
  const key = getKey(applicationId, uri)
  writeVersions.set(key, (writeVersions.get(key) || 0) + 1)
  const previousWrite = writeQueues.get(key) || Promise.resolve()
  const remove = previousWrite.catch(() => {}).then(() => CacheWorker.invoke('Cache.removeCacheStorageItem', key, cacheName))
  writeQueues.set(key, remove)
  try {
    return await remove
  } finally {
    if (writeQueues.get(key) === remove) {
      writeQueues.delete(key)
    }
  }
}

export const set = async (applicationId, uri, fingerprint, content) => {
  if (isExcluded(uri) || new TextEncoder().encode(content).byteLength > maxBytes) {
    return
  }
  const key = getKey(applicationId, uri)
  const version = (writeVersions.get(key) || 0) + 1
  writeVersions.set(key, version)
  const previousWrite = writeQueues.get(key) || Promise.resolve()
  const write = previousWrite.catch(() => {}).then(async () => {
    if (writeVersions.get(key) !== version) {
      return
    }
    const currentStat = await getStat(applicationId, uri)
    if (getFingerprint(currentStat) !== fingerprint) {
      return
    }
    const expires = new Date(Date.now() + expiresIn).toUTCString()
    const result = await CacheWorker.invoke('Cache.setCacheStorageItem', key, content, cacheName, {
      'cache-control': 'public, max-age=7776000',
      'content-type': 'text/plain; charset=utf-8',
      expires,
      'x-lvce-editor-file-stat': fingerprint,
    })
    if (!result?.success) {
      throw new Error(result?.errorMessage || 'Failed to cache editor file')
    }
    const verifiedStat = await getStat(applicationId, uri)
    if (getFingerprint(verifiedStat) !== fingerprint) {
      await CacheWorker.invoke('Cache.removeCacheStorageItem', key, cacheName)
    }
  })
  writeQueues.set(key, write)
  try {
    await write
  } finally {
    if (writeQueues.get(key) === write) {
      writeQueues.delete(key)
    }
  }
}
