export const exposeGlobals = (global, object) => {
  for (const [key, value] of Object.entries(object)) {
    global[key] = value
  }
}
export const unExposeGlobals = (global, object) => {
  for (const key of Object.keys(object)) {
    delete global[key]
  }
}
