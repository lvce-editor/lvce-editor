export const canUseBlobFromFileLoading = (uri) => {
  // TODO only if uri starts with html://
  return uri.startsWith('html://')
}
