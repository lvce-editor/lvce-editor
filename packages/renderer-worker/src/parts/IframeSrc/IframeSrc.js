import * as Character from '../Character/Character.js'

const isValidHttpUrl = (string) => {
  if (!string.startsWith('http:') && !string.startsWith('https:')) {
    return false
  }
  try {
    const url = new URL(string)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

const createUrl = (baseUrl, params) => {
  return baseUrl + '?' + new URLSearchParams(params).toString()
}

const createSearchUrlWithGoogle = (input) => {
  const searchUrl = 'https://www.google.com/search'
  const params = {
    q: input,
  }
  return createUrl(searchUrl, params)
}

// TODO add preference option for search engine
const createSearchUrl = (input) => {
  return createSearchUrlWithGoogle(input)
}

const isValidFileUrl = (input) => {
  return input.startsWith('file://')
}

const isValidFilePath = (input) => {
  return input.startsWith(Character.Slash)
}

const isLocalHostUrlWithOutHttp = (input) => {
  return input.startsWith('localhost:')
}

export const isSearchInput = (input, shortcuts = []) => {
  if (typeof input !== 'string' || input.trim().length === 0) {
    return false
  }
  for (const shortcut of shortcuts) {
    if (shortcut && shortcut.prefix === input && typeof shortcut.url === 'string') {
      return false
    }
  }
  if (isValidHttpUrl(input) || isValidFileUrl(input) || isLocalHostUrlWithOutHttp(input) || isValidFilePath(input)) {
    return false
  }
  const dotIndex = input.indexOf(Character.Dot)
  return dotIndex === -1 || dotIndex === input.length - 1
}

export const toIframeSrc = (input, shortcuts = []) => {
  const trimmedInput = input.trim()
  for (const shortcut of shortcuts) {
    if (shortcut && shortcut.prefix === trimmedInput && typeof shortcut.url === 'string') {
      return shortcut.url
    }
  }
  if (isValidHttpUrl(trimmedInput) || isValidFileUrl(trimmedInput)) {
    return trimmedInput
  }
  if (isLocalHostUrlWithOutHttp(trimmedInput)) {
    return `http://${trimmedInput}`
  }
  if (isValidFilePath(trimmedInput)) {
    return 'file://' + trimmedInput
  }
  const dotIndex = trimmedInput.indexOf(Character.Dot)
  if (dotIndex !== -1 && dotIndex !== trimmedInput.length - 1) {
    return 'https://' + trimmedInput
  }
  return createSearchUrl(trimmedInput)
}
