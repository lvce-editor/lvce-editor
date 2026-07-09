const map = Object.create(null)

export const set = (url, contentSecurityPolicy) => {
  map[url] = contentSecurityPolicy
}

export const get = (url) => {
  return map[url]
}
