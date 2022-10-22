const isValidHttpUrl = (string) => {
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

export const toIframeSrc = (input) => {
  if (isValidHttpUrl(input)) {
    return input
  }
  const dotIndex = input.indexOf('.')
  if (dotIndex !== -1 && dotIndex !== input.length - 1) {
    return 'https://' + input
  }
  return createSearchUrl(input)
}
