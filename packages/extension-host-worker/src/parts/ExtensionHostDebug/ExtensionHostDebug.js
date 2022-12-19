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
  state.debugProviderMap[debugProvider.id] = debugProvider
}

export const listProcesses = async (protocol, path) => {
  try {
    const provider = getDebugProvider(protocol)
    return await provider.listProcesses(path)
  } catch (error) {
    throw new VError(error, 'Failed to execute debug provider')
  }
}

export const continue_ = async (protocol) => {
  try {
    const provider = getDebugProvider(protocol)
    return await provider.continue_()
  } catch (error) {
    throw new VError(error, 'Failed to execute debug provider')
  }
}

export const pause = async (protocol) => {
  try {
    const provider = getDebugProvider(protocol)
    return await provider.continue_()
  } catch (error) {
    throw new VError(error, 'Failed to execute debug provider')
  }
}

export const setPauseOnException = async (protocol, value) => {
  try {
    const provider = getDebugProvider(protocol)
    return await provider.setPauseOnExceptions(value)
  } catch (error) {
    throw new VError(error, 'Failed to execute debug provider')
  }
}
