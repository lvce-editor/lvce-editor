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
    throw new Error('no source control provider found')
  }
  const changedFiles = await getFilesFromProvider(provider)
  const flattenedChangedFiles = changedFiles
  return flattenedChangedFiles
}

export const getFileBefore = async (providerId, uri) => {
  Assert.string(providerId)
  Assert.string(uri)
  const provider = state.providers[providerId]
  if (!provider) {
    throw new Error('no source control provider found')
  }
  return provider.getFileBefore(uri)
}

const getGroupsFromProvider = async (provider, cwd) => {
  if (provider.getGroups) {
    return provider.getGroups(cwd)
  }
  if (provider.getChangedFiles) {
    const files = await provider.getChangedFiles()
    const groups = [
      {
        id: 'changes',
        label: 'Changes',
        items: files,
      },
    ]
    return groups
  }
  throw new Error('source control provider is missing required function getGroups')
}

export const getGroups = async (providerId, cwd) => {
  const provider = state.providers[providerId]
  if (!provider) {
    throw new Error('no source control provider found')
  }
  const groups = await getGroupsFromProvider(provider, cwd)
  return groups
}

export const acceptInput = async (providerId, value) => {
  const provider = state.providers[providerId]
  if (!provider) {
    throw new Error('no source control provider found')
  }
  await provider.acceptInput(value)
}

export const add = async (path) => {
  const provider = Object.values(state.providers)[0]
  if (!provider) {
    return
  }
  // @ts-ignore
  await provider.add(path)
}

export const discard = async (path) => {
  const provider = Object.values(state.providers)[0]
  if (!provider) {
    return
  }
  // @ts-ignore
  await provider.discard(path)
}

export const getEnabledProviderIds = async (scheme, root) => {
  Assert.string(scheme)
  Assert.string(root)
  const providers = Object.values(state.providers)
  const enabledIds = []
  for (const provider of providers) {
    // @ts-ignore
    if (typeof provider.isActive !== 'function') {
      continue
    }
    // @ts-ignore
    const isActive = await provider.isActive(scheme, root)
    if (isActive) {
      // @ts-ignore
      enabledIds.push(provider.id)
    }
  }
  return enabledIds
}

export const reset = () => {
  state.providers = Object.create(null)
}
