const cacheName = 'lvce-application-view-state'

export const write = async (value: unknown): Promise<string> => {
  const url = new URL(`.view-state/${crypto.randomUUID()}`, location.href).href
  const cache = await caches.open(cacheName)
  await cache.put(url, Response.json(value, { headers: { 'Content-Type': 'application/json' } }))
  return url
}

export const read = async (url: string): Promise<unknown> => {
  const cache = await caches.open(cacheName)
  const response = await cache.match(url)
  return response?.json()
}

export const remove = async (url: string): Promise<void> => {
  const cache = await caches.open(cacheName)
  await cache.delete(url)
}
