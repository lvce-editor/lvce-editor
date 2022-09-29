export const state = {
  providers: Object.create(null),
}

export const registerSourceControlProvider = (provider) => {
  state.providers[provider.id] = provider
}

const getFilesFromProvider = (provider) => {
  return provider.getChangedFiles()
}

export const getChangedFiles = () => {
  const providers = Object.values(state.providers)
  const changedFiles = providers.map(getFilesFromProvider)
  const flattenedChangedFiles = changedFiles.flat(1)
  return flattenedChangedFiles
}

export const reset = () => {
  state.providers = Object.create(null)
}
