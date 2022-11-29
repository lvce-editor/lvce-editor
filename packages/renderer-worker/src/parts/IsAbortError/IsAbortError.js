export const isAbortError = (error) => {
  return error && error.name === 'AbortError'
}
