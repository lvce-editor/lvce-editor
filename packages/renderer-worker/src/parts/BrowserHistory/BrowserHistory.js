import * as LocalStorage from '../LocalStorage/LocalStorage.js'

const maximumEntries = 1000
const storageKey = 'simple-browser-history'
let pendingMutation = Promise.resolve()

const isSupportedUrl = (value) => {
  if (typeof value !== 'string') {
    return false
  }
  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

const normalizeEntry = (entry) => {
  if (!entry || typeof entry !== 'object' || !Number.isFinite(new Date(entry.date).getTime()) || !isSupportedUrl(entry.url)) {
    return undefined
  }
  return {
    date: entry.date,
    url: entry.url,
  }
}

export const normalize = (value) => {
  if (!Array.isArray(value)) {
    return []
  }
  /** @type {Array<{date: number, url: string}>} */
  const entries = []
  for (const item of value) {
    const entry = normalizeEntry(item)
    if (entry) {
      entries.push(entry)
    }
  }
  return entries.sort((a, b) => b.date - a.date).slice(0, maximumEntries)
}

const loadFromStorage = async () => {
  try {
    return normalize(await LocalStorage.getJson(storageKey))
  } catch {
    return []
  }
}

const saveToStorage = async (entries) => {
  try {
    await LocalStorage.setJson(storageKey, entries)
  } catch {
    // Browsing should continue when local storage is unavailable or full.
  }
}

const mutate = (fn) => {
  const operation = pendingMutation.then(async () => {
    const entries = await loadFromStorage()
    const newEntries = fn(entries)
    if (newEntries !== entries) {
      await saveToStorage(newEntries)
    }
    return newEntries
  })
  pendingMutation = operation.then(
    () => undefined,
    () => undefined,
  )
  return operation
}

export const load = async () => {
  await pendingMutation
  return loadFromStorage()
}

export const add = (entries, url, date = Date.now()) => {
  const entry = normalizeEntry({ date, url })
  if (!entry) {
    return entries
  }
  return normalize([entry, ...entries])
}

export const remove = (entries, index) => {
  const parsedIndex = Number(index)
  if (!Number.isInteger(parsedIndex) || parsedIndex < 0 || parsedIndex >= entries.length) {
    return entries
  }
  return entries.toSpliced(parsedIndex, 1)
}

export const record = async (url, date = Date.now()) => {
  const entry = normalizeEntry({ date, url })
  if (!entry) {
    return undefined
  }
  return mutate((entries) => normalize([entry, ...entries]))
}

export const clear = () => {
  return mutate(() => [])
}

export const removeEntry = async (entry) => {
  const normalizedEntry = normalizeEntry(entry)
  if (!normalizedEntry) {
    return undefined
  }
  return mutate((entries) => {
    const index = entries.findIndex(({ date, url }) => date === normalizedEntry.date && url === normalizedEntry.url)
    return remove(entries, index)
  })
}
