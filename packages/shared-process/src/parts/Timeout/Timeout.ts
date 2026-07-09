export const setTimeout = (listener: any, ms: any): any => {
  return globalThis.setTimeout(listener, ms)
}

export const clearTimeout = (timeoutId: any): any => {
  globalThis.clearTimeout(timeoutId)
}
