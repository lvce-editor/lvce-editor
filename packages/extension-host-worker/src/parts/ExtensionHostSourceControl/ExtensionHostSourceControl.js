import * as Assert from '../Assert/Assert.js'

export const state = {
  providers: Object.create(null),
}

export const registerSourceControlProvider = (provider) => {
  state.providers[provider.id] = provider
}

const getFilesFromProvider = (provider) => {
  return provider.getChangedFiles()
}

export const getChangedFiles = async (providerId) => {
  const provider = state.providers[providerId]
  if (!provider) {
    throw new Error(`no source control provider found`)
  }
  const changedFiles = await getFilesFromProvider(provider)
  const flattenedChangedFiles = changedFiles
  return flattenedChangedFiles
}

export const acceptInput = async (providerId, value) => {
  const provider = state.providers[providerId]
  if (!provider) {
    throw new Error(`no source control provider found`)
  }
  await provider.acceptInput(value)
}

export const add = async (path) => {
  const provider = Object.values(state.providers)[0]
  if (!provider) {
    return
  }
  await provider.add(path)
}

export const discard = async (path) => {
  const provider = Object.values(state.providers)[0]
  if (!provider) {
    return
  }
  await provider.discard(path)
}

export const getEnabledProviderIds = async (scheme, root) => {
  Assert.string(scheme)
  Assert.string(root)
  const providers = Object.values(state.providers)
  const enabledIds = []
  for (const provider of providers) {
    if (typeof provider.isActive !== 'function') {
      continue
    }
    const isActive = await provider.isActive(scheme, root)
    if (isActive) {
      enabledIds.push(provider.id)
    }
  }
  console.log({ enabledIds })
  return enabledIds
}

export const reset = () => {
  state.providers = Object.create(null)
}
