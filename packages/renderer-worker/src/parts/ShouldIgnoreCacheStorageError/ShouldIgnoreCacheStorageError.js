export const shouldIgnoreCacheStorageError = (error) => {
  // Firefox throws dom exception in private mode
  return error && error instanceof DOMException && error.message === 'The operation is insecure.'
}
