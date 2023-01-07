export const exposeGlobals = (global, object) => {
  for (const [key, value] of Object.entries(object)) {
    global[key] = value
  }
}
