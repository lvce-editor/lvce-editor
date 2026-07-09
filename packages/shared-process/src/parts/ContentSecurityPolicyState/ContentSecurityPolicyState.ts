const map = Object.create(null)

export const set = (url: any, contentSecurityPolicy: any): any => {
  map[url] = contentSecurityPolicy
}

export const get = (url: any): any => {
  return map[url]
}
