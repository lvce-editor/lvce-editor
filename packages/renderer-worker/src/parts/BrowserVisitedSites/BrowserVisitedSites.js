import * as LocalStorage from '../LocalStorage/LocalStorage.js'

const storageKey = 'simple-browser-visited-sites'
const maximumVisitedSites = 100
const maximumFaviconLength = 4096

const getOrigin = (value) => {
  try {
    const url = new URL(value)
    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      return undefined
    }
    return url.origin
  } catch {
    return undefined
  }
}

const isValidFavicon = (favicon) => {
  if (typeof favicon !== 'string' || favicon.length === 0 || favicon.length > maximumFaviconLength) {
    return false
  }
  if (favicon.startsWith('data:image/')) {
    return true
  }
  return Boolean(getOrigin(favicon))
}

const normalizeSite = (site) => {
  if (!site || typeof site !== 'object') {
    return undefined
  }
  const origin = getOrigin(site.origin)
  if (!origin || !isValidFavicon(site.favicon)) {
    return undefined
  }
  return {
    favicon: site.favicon,
    origin,
  }
}

export const normalize = (value) => {
  if (!Array.isArray(value)) {
    return []
  }
  const sites = []
  const origins = new Set()
  for (const item of value) {
    const site = normalizeSite(item)
    if (!site || origins.has(site.origin)) {
      continue
    }
    origins.add(site.origin)
    sites.push(site)
    if (sites.length === maximumVisitedSites) {
      break
    }
  }
  return sites
}

export const load = async () => {
  try {
    return normalize(await LocalStorage.getJson(storageKey))
  } catch {
    return []
  }
}

export const save = async (sites) => {
  try {
    await LocalStorage.setJson(storageKey, sites)
  } catch {
    // Browsing should continue when local storage is unavailable or full.
  }
}

export const add = (sites, url, favicon) => {
  const origin = getOrigin(url)
  if (!origin || !isValidFavicon(favicon)) {
    return sites
  }
  const newSite = { favicon, origin }
  return [newSite, ...sites.filter((site) => site.origin !== origin)].slice(0, maximumVisitedSites)
}

export const getSuggestions = (sites, query) => {
  const normalizedQuery = query.trim().toLowerCase()
  if (normalizedQuery.length < 2) {
    return []
  }
  return sites
    .filter((site) => site.origin.toLowerCase().includes(normalizedQuery))
    .slice(0, 4)
    .map((site) => ({ favicon: site.favicon, type: 'url', value: site.origin }))
}
