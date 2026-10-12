export const selectExtensionManifestFields = (manifests: readonly any[], fields?: readonly string[]): readonly any[] => {
  if (fields === undefined) {
    return manifests
  }
  return manifests.map((manifest) =>
    Object.fromEntries(fields.filter((field) => Object.hasOwn(manifest, field)).map((field) => [field, manifest[field]])),
  )
}
