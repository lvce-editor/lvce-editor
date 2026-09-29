export const requestAnimationFrame = (fn) => {
  return globalThis.requestAnimationFrame(fn)
}

export const has = (fn) => {}

export const clear = () => {}

export const cancelAnimationFrame = (id) => {
  globalThis.cancelAnimationFrame(id)
}
