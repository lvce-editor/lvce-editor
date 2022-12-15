import { VError } from '../VError/VError.js'

export const state = {
  debugProviderMap: Object.create(null),
}

const getDebugProvider = (id) => {
  const provider = state.debugProviderMap[id]
  if (!provider) {
    throw new VError(`no debug provider "${id}" found`)
  }
  return provider
}

export const registerDebugProvider = (debugProvider) => {
  if (!debugProvider.id) {
    throw new Error(`Failed to register debug system provider: missing id`)
  }
  state.fileSystemProviderMap[debugProvider.id] = debugProvider
}

export const listProcesses = async (protocol, path) => {
  try {
    const provider = getDebugProvider(protocol)
    return await provider.readDirWithFileTypes(path)
  } catch (error) {
    throw new VError(error, 'Failed to execute file system provider')
  }
}
