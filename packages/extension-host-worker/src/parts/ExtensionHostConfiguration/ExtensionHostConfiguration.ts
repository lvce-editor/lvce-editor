export const state = {
  configuration: Object.create(null),
}

export const getConfiguration = (key) => {
  return state.configuration[key] ?? ''
}

export const setConfigurations = (preferences) => {
  state.configuration = preferences
}
