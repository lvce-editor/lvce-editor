import * as LocalStorage from '../LocalStorage/LocalStorage.js'

const storageKey = 'simple-browser-search-history'
const maximumSearches = 100
const maximumSearchLength = 2048

const normalizeSearch = (value) => {
  if (typeof value !== 'string') {
    return undefined
  }
  const search = value.trim()
  if (search.length === 0 || search.length > maximumSearchLength) {
    return undefined
  }
  return search
}

export const normalize = (value) => {
  if (!Array.isArray(value)) {
    return []
  }
  const searches = []
  const normalizedSearches = new Set()
  for (const item of value) {
    const search = normalizeSearch(item)
    const normalizedSearch = search?.toLowerCase()
    if (!search || normalizedSearches.has(normalizedSearch)) {
      continue
    }
    normalizedSearches.add(normalizedSearch)
    searches.push(search)
    if (searches.length === maximumSearches) {
      break
    }
  }
  return searches
}

export const load = async () => {
  try {
    return normalize(await LocalStorage.getJson(storageKey))
  } catch {
    return []
  }
}

export const save = async (searches) => {
  try {
    await LocalStorage.setJson(storageKey, searches)
  } catch {
    // Searching should continue when local storage is unavailable or full.
  }
}

export const add = (searches, value) => {
  const search = normalizeSearch(value)
  if (!search) {
    return searches
  }
  const normalizedSearch = search.toLowerCase()
  if (searches[0]?.toLowerCase() === normalizedSearch) {
    return searches
  }
  return [search, ...searches.filter((item) => item.toLowerCase() !== normalizedSearch)].slice(0, maximumSearches)
}

export const getSuggestions = (searches, query) => {
  const normalizedQuery = query.trim().toLowerCase()
  if (normalizedQuery.length < 2) {
    return []
  }
  return searches
    .filter((search) => search.toLowerCase().startsWith(normalizedQuery) && search.toLowerCase() !== normalizedQuery)
    .slice(0, 4)
    .map((value) => ({ favicon: '', type: 'history', value }))
}
