const CACHE_STATIC_NAME = 'static-v4'
const CACHE_DYNAMIC_NAME = 'dynamic-v2'

const getPathName = (url) => {
  return new URL(url).pathname
}

const getTitle = (url) => {
  const pathSeparator = '/'
  const pathName = getPathName(url)
  if (pathName.startsWith('/github')) {
    return pathName.slice(pathName.lastIndexOf(pathSeparator) + 1)
  }
  if (pathName === '/') {
    return 'playground'
  }
  return pathName
}

// see https://stackoverflow.com/questions/6234773/can-i-escape-html-special-chars-in-javascript
const escapeHtml = (string) => {
  return string
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

// TODO could also ssr title bar and activity bar to have less flicker
// currently there is still a lot of flicker:
// 1. skeleton loads
// 2. tab title loads
// 3. file content loads (no syntax highlighting)
// 4. explorer loads (no icons)
// 5. activity bar loads
// 6. explorer icons load
// 7. title bar loads
// 8. file syntax highlighting loads

// maybe it would be better to do
// if session exists in sessionStorage -> wait for everything -> one paint
// else do the steps as above (maybe it should be less steps)
const handleFetchIndexHtml = async (request) => {
  // TODO instead of loading from network, could also just store it as s string here
  // and send the response to avoid waiting 10ms for the cache
  console.time('service-worker-cached-response')
  const cachedResponse = await caches.match('/index.html', {
    cacheName: CACHE_STATIC_NAME,
  })
  console.timeEnd('service-worker-cached-response')
  if (!cachedResponse) {
    console.info('[service-worker] no cached response')
    return fetch(request)
  }
  const text = await cachedResponse.text()
  const newTitle = getTitle(request.url)
  const newTitleEscaped = escapeHtml(newTitle)
  const newText = text.replace(
    '<title>Code Editor</title>',
    `<title>${newTitleEscaped}</title>`
  )
  console.info(`setting title to ${newTitle}`)
  const newResponse = new Response(newText, {
    headers: cachedResponse.headers,
    status: cachedResponse.status,
    statusText: cachedResponse.statusText,
  })
  console.info('responding with new text')
  return newResponse
}

const handleFetch = async (event) => {
  if (event.request.destination === 'document') {
    event.respondWith(handleFetchIndexHtml(event.request))
  }
}

const addResourcesToCache = async (resources) => {
  // console.log('[Service Worker] Precaching App Shell')
  const cache = await caches.open(CACHE_STATIC_NAME)
  await cache.addAll(resources)
  // console.log('[Service Worker] Finished Precaching App Shell')
}

const handleInstall = (event) => {
  // @ts-ignore
  skipWaiting()
  event.waitUntil(addResourcesToCache(['/index.html']))
}

const main = () => {
  addEventListener('fetch', handleFetch)
  addEventListener('install', handleInstall)
}

main()
