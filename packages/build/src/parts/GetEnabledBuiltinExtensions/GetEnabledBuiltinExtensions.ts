export const getEnabledBuiltinExtensions = (extensions) => {
  return extensions.filter((extension) => extension.enabled !== false)
}
