// Compare the JSON representation exposed by live state files, ignoring schema metadata.
export const serializeComponentState = (state) => {
  const { $schema, ...componentState } = state
  return JSON.stringify(Array.isArray(state) ? state : componentState, (_key, value) => {
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      return Object.fromEntries(
        Object.keys(value)
          .sort()
          .map((key) => [key, value[key]]),
      )
    }
    return value
  })
}
