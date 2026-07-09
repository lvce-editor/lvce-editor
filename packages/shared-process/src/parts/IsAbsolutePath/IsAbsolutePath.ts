const RE_ABSOLUTE_URI = /^[a-z]+:\/\//

export const isAbsolutePath = (path) => {
  return RE_ABSOLUTE_URI.test(path)
}
