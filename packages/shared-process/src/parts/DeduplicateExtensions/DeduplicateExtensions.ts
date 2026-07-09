export const deduplicateExtensions = (extensions: any, builtinExtensionsPath: any): any => {
  const seen = Object.create(null)
  const uniqueExtensions: any[] = []
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
