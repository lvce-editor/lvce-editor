export const findMatchingIconThemeExtension = (extensions: readonly any[], iconThemeId: string) => {
  for (const extension of extensions) {
    if (extension && extension.iconThemes) {
      for (const iconTheme of extension.iconThemes) {
        if (iconTheme.id === iconThemeId) {
          return {
            ...iconTheme,
            extensionPath: extension.path,
          }
        }
      }
    }
  }
  return undefined
}
