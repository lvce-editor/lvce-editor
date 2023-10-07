const RE_EXTENSION_FRAGMENT = /.+(\/|\\)(.+)$/

export const inferExtensionId = (absolutePath) => {
  const match = absolutePath.match(RE_EXTENSION_FRAGMENT)
  if (match) {
    return match[2]
  }
  return ''
}
