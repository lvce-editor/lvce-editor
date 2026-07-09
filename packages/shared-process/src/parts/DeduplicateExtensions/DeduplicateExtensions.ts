export const deduplicateExtensions = (extensions, builtinExtensionsPath) => {
  const seen = Object.create(null)
  const uniqueExtensions = []
  for (const extension of extensions) {
    if (extension.id in seen) {
      continue
    }
    seen[extension.id] = true
    if (extension.path.startsWith(builtinExtensionsPath)) {
      extension.builtin = true
    }
    uniqueExtensions.push(extension)
  }
  return uniqueExtensions
}
