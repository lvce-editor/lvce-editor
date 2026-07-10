const databaseName = 'handle'
const databaseVersion = 1
const objectStoreName = 'file-handles-store'
const handlePrefix = 'local-extension://'
const routeSegment = '/local-extensions/'

const mimeTypes = {
  '.css': 'text/css',
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.mjs': 'text/javascript',
  '.svg': 'image/svg+xml',
  '.wasm': 'application/wasm',
}

const getMimeType = (path, fallback) => {
  if (fallback) {
    return fallback
  }
  const dotIndex = path.lastIndexOf('.')
  if (dotIndex === -1) {
    return 'application/octet-stream'
  }
  return mimeTypes[path.slice(dotIndex).toLowerCase()] || 'application/octet-stream'
}

const openDatabase = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(databaseName, databaseVersion)
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)
  })
}

const getHandle = async (id) => {
  const database = await openDatabase()
  try {
    return await new Promise((resolve, reject) => {
      const transaction = database.transaction(objectStoreName, 'readonly')
      const request = transaction.objectStore(objectStoreName).get(`${handlePrefix}${id}`)
      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result)
    })
  } finally {
    database.close()
  }
}

const getFile = async (rootHandle, segments) => {
  let directoryHandle = rootHandle
  for (const segment of segments.slice(0, -1)) {
    directoryHandle = await directoryHandle.getDirectoryHandle(segment)
  }
  const fileHandle = await directoryHandle.getFileHandle(segments.at(-1))
  return fileHandle.getFile()
}

const getRequestPath = (url) => {
  const routeIndex = url.pathname.lastIndexOf(routeSegment)
  if (routeIndex === -1) {
    return undefined
  }
  const encodedPath = url.pathname.slice(routeIndex + routeSegment.length)
  const segments = encodedPath.split('/').filter(Boolean).map(decodeURIComponent)
  if (segments.length < 2) {
    return undefined
  }
  return {
    id: segments[0],
    segments: segments.slice(1),
  }
}

const handleRequest = async (request) => {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    return new Response('Method Not Allowed', { status: 405 })
  }
  const requestPath = getRequestPath(new URL(request.url))
  if (!requestPath) {
    return fetch(request)
  }
  try {
    const rootHandle = await getHandle(requestPath.id)
    if (!rootHandle) {
      return new Response('Extension not found', { status: 404 })
    }
    const file = await getFile(rootHandle, requestPath.segments)
    const headers = {
      'Cache-Control': 'no-store',
      'Content-Type': getMimeType(requestPath.segments.at(-1), file.type),
    }
    return new Response(request.method === 'HEAD' ? undefined : file, { headers })
  } catch (error) {
    return new Response(error instanceof Error ? error.message : 'Failed to read extension file', { status: 404 })
  }
}

self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting())
})

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim())
})

self.addEventListener('fetch', (event) => {
  if (new URL(event.request.url).pathname.includes(routeSegment)) {
    event.respondWith(handleRequest(event.request))
  }
})
