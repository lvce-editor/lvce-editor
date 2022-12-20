import { VError } from '../VError/VError.js'
import * as Rpc from '../Rpc/Rpc.js'

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
    const emitter = new EventTarget()
    const handlePaused = () => {
      Rpc.send('Debug.paused')
    }
    const handleResumed = () => {
      Rpc.send('Debug.resumed')
    }
    emitter.addEventListener('paused', handlePaused)
    emitter.addEventListener('resumed', handleResumed)
    const provider = getDebugProvider(protocol)
    return await provider.listProcesses(emitter, path)
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
    return await provider.pause()
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
