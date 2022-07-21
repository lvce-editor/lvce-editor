export const setTimeout = (listener, ms) => {
  return globalThis.setTimeout(listener, ms)
}

export const clearTimeout = (timeoutId) => {
  globalThis.clearTimeout(timeoutId)
}
