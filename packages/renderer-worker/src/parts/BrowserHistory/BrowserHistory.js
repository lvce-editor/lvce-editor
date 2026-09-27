import * as LocalStorage from '../LocalStorage/LocalStorage.js'
import * as IndexedDbKeyValueStorage from '../IndexedDbKeyValueStorage/IndexedDbKeyValueStorage.js'

const maximumEntries = 100_000
const legacyStorageKey = 'simple-browser-history'
const storageKey = 'simple-browser-history-v2'
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
  let isSorted = true
  for (const item of value) {
    const entry = normalizeEntry(item)
    if (entry) {
      const previousEntry = entries.at(-1)
      if (previousEntry && previousEntry.date < entry.date) {
        isSorted = false
      }
      entries.push(entry)
    }
  }
  if (!isSorted) {
    entries.sort((a, b) => b.date - a.date)
  }
  return entries.length > maximumEntries ? entries.slice(0, maximumEntries) : entries
}

const loadFromStorage = async () => {
  try {
    const storedEntries = await IndexedDbKeyValueStorage.get(storageKey)
    if (Array.isArray(storedEntries)) {
      return normalize(storedEntries)
    }
  } catch {
    // Read and migrate the previous local-storage value below.
  }
  try {
    const legacyEntries = normalize(await LocalStorage.getJson(legacyStorageKey))
    await IndexedDbKeyValueStorage.set(storageKey, legacyEntries)
    return legacyEntries
  } catch {
    return []
  }
}

const saveToStorage = async (entries) => {
  try {
    await IndexedDbKeyValueStorage.set(storageKey, entries)
  } catch {
    // Browsing should continue when history storage is unavailable.
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
  let start = 0
  let end = entries.length
  while (start < end) {
    const middle = Math.floor((start + end) / 2)
    if (entries[middle].date > entry.date) {
      start = middle + 1
    } else {
      end = middle
    }
  }
  const newEntries = entries.toSpliced(start, 0, entry)
  return newEntries.length > maximumEntries ? newEntries.slice(0, maximumEntries) : newEntries
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
  return mutate((entries) => add(entries, entry.url, entry.date))
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

export const getSuggestions = (entries, query) => {
  const text = query.trim().toLowerCase()
  if (text.length < 2) return []
  const seen = new Set()
  return entries
    .filter(({ url }) => {
      if (!url.toLowerCase().includes(text) || seen.has(url)) return false
      seen.add(url)
      return true
    })
    .slice(0, 4)
    .map(({ url }) => ({ value: url, type: 'url', favicon: '' }))
}
