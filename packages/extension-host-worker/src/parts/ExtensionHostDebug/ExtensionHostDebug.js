import { VError } from '../VError/VError.js'
import * as Rpc from '../Rpc/Rpc.js'
import * as Assert from '../Assert/Assert.js'

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

export const start = async (protocol, path) => {
  try {
    const handlePaused = (params) => {
      console.log('send paused', params)
      Rpc.send('Debug.paused', params)
    }
    const handleResumed = () => {
      Rpc.send('Debug.resumed')
    }
    const provider = getDebugProvider(protocol)
    await provider.start({ handlePaused, handleResumed }, path)
  } catch (error) {
    throw new VError(error, 'Failed to execute debug provider')
  }
}

export const listProcesses = async (protocol, path) => {
  try {
    const provider = getDebugProvider(protocol)
    const processes = await provider.listProcesses(path)
    Assert.array(processes)
    return processes
  } catch (error) {
    throw new VError(error, 'Failed to execute debug provider')
  }
}

export const resume = async (protocol) => {
  try {
    const provider = getDebugProvider(protocol)
    return await provider.resume()
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

export const step = async (protocol) => {
  try {
    const provider = getDebugProvider(protocol)
    return await provider.step()
  } catch (error) {
    throw new VError(error, 'Failed to execute debug provider')
  }
}

export const stepInto = async (protocol) => {
  try {
    const provider = getDebugProvider(protocol)
    return await provider.stepInto()
  } catch (error) {
    throw new VError(error, 'Failed to execute debug provider')
  }
}

export const stepOut = async (protocol) => {
  try {
    const provider = getDebugProvider(protocol)
    return await provider.stepOut()
  } catch (error) {
    throw new VError(error, 'Failed to execute debug provider')
  }
}

export const stepOver = async (protocol) => {
  try {
    const provider = getDebugProvider(protocol)
    return await provider.stepOver()
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
