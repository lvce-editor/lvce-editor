import * as ApplicationFileSystem from '../ApplicationFileSystem/ApplicationFileSystem.ts'
import * as CacheWorker from '../CacheWorker/CacheWorker.js'
import * as FileSystem from '../FileSystem/FileSystem.js'
import * as Mime from '../Mime/Mime.js'

const cacheName = 'editor-file-cache'
const maxBytes = 10 * 1024 * 1024
const expiresIn = 90 * 24 * 60 * 60 * 1000
const uriSuffixRegex = /[?#]/
const writeQueues = new Map()
const writeVersions = new Map()

const encodeUriPath = (value) => {
  return encodeURIComponent(value)
    .replaceAll('%2F', '/')
    .replace(/(^|\/)(\.{1,2})(?=\/|$)/g, (_match, separator, dotSegment) => `${separator}${'%252E'.repeat(dotSegment.length)}`)
}

const getKey = (applicationId, uri) => {
  const schemeSeparator = uri.indexOf(':')
  const scheme = schemeSeparator === -1 ? 'unknown' : uri.slice(0, schemeSeparator)
  const uriPath = schemeSeparator === -1 ? uri : uri.slice(schemeSeparator + 1)
  const leadingSlashes = uriPath.match(/^\/+/)
  const leadingSlashCount = leadingSlashes ? leadingSlashes[0].length : 0
  const readablePath = uriPath.slice(leadingSlashCount)
  const query = new URLSearchParams()
  if (applicationId) {
    query.set('applicationId', applicationId)
  }
  if (leadingSlashCount) {
    query.set('leadingSlashes', String(leadingSlashCount))
  }
  const queryString = query.toString()
  return `https://lvce-editor.invalid/editor-file-cache/${scheme}/${encodeUriPath(readablePath)}${queryString ? `?${queryString}` : ''}`
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

const getContentType = (uri) => {
  const path = uri.split(uriSuffixRegex, 1)[0]
  const mime = Mime.getTextMime(path)
  const contentType = mime === 'text/javascript' ? 'application/javascript' : mime || 'text/plain'
  return `${contentType}; charset=utf-8`
}

const getStat = (applicationId, uri) =>
  applicationId ? ApplicationFileSystem.execute(applicationId, 'statWithMetadata', uri) : FileSystem.statWithMetadata(uri)

const isExcluded = (uri) => {
  const path = uri.split(uriSuffixRegex, 1)[0]
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
  const contentLength = new TextEncoder().encode(content).byteLength
  if (isExcluded(uri) || contentLength > maxBytes) {
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
      'content-length': String(contentLength),
      'content-type': getContentType(uri),
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
