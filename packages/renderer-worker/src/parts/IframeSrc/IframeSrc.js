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
  return input.startsWith('/')
}

export const toIframeSrc = (input) => {
  if (isValidHttpUrl(input) || isValidFileUrl(input)) {
    return input
  }
  if (isValidFilePath(input)) {
    return 'file://' + input
  }
  const dotIndex = input.indexOf('.')
  if (dotIndex !== -1 && dotIndex !== input.length - 1) {
    return 'https://' + input
  }
  return createSearchUrl(input)
}
