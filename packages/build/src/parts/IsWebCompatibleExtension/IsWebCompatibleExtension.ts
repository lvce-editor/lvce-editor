interface ExtensionManifest {
  readonly compatibility?: {
    readonly web?: boolean
  }
}

export const isWebCompatibleExtension = (extension: ExtensionManifest): boolean => {
  return extension.compatibility?.web !== false
}
