export const state = {
  providers: Object.create(null),
}

export const registerSourceControlProvider = (provider) => {
  state.providers[provider.id] = provider
}

const getFilesFromProvider = (provider) => {
  return provider.getChangedFiles()
}

export const getChangedFiles = async () => {
  const providers = Object.values(state.providers)
  const changedFiles = await Promise.all(providers.map(getFilesFromProvider))
  const flattenedChangedFiles = changedFiles.flat(1)
  return flattenedChangedFiles
}

export const acceptInput = async (value) => {
  const provider = Object.values(state.providers)[0]
  if (!provider) {
    return
  }
  await provider.acceptInput(value)
}

export const reset = () => {
  state.providers = Object.create(null)
}
