import * as Assert from '../Assert/Assert.ts'
import * as ExtensionHostShared from './ExtensionHostShared.js'

export const listProcesses = async (debugId) => {
  const processes = await ExtensionHostShared.executeProvider({
    event: `onDebug:${debugId}`,
    method: 'ExtensionHostDebug.listProcesses',
    params: [debugId],
    noProviderFoundMessage: 'no debug provider found',
  })
  Assert.array(processes)
  return processes
}

export const resume = (debugId) => {
  return ExtensionHostShared.executeProvider({
    event: `onDebug:${debugId}`,
    method: 'ExtensionHostDebug.resume',
    params: [debugId],
    noProviderFoundMessage: 'no debug provider found',
  })
}

export const pause = (debugId) => {
  return ExtensionHostShared.executeProvider({
    event: `onDebug:${debugId}`,
    method: 'ExtensionHostDebug.pause',
    params: [debugId],
    noProviderFoundMessage: 'no debug provider found',
  })
}

export const stepOver = (debugId) => {
  return ExtensionHostShared.executeProvider({
    event: `onDebug:${debugId}`,
    method: 'ExtensionHostDebug.stepOver',
    params: [debugId],
    noProviderFoundMessage: 'no debug provider found',
  })
}

export const stepInto = (debugId) => {
  return ExtensionHostShared.executeProvider({
    event: `onDebug:${debugId}`,
    method: 'ExtensionHostDebug.stepInto',
    params: [debugId],
    noProviderFoundMessage: 'no debug provider found',
  })
}

export const stepOut = (debugId) => {
  return ExtensionHostShared.executeProvider({
    event: `onDebug:${debugId}`,
    method: 'ExtensionHostDebug.stepOut',
    params: [debugId],
    noProviderFoundMessage: 'no debug provider found',
  })
}

export const step = (debugId) => {
  return ExtensionHostShared.executeProvider({
    event: `onDebug:${debugId}`,
    method: 'ExtensionHostDebug.step',
    params: [debugId],
    noProviderFoundMessage: 'no debug provider found',
  })
}

export const setPauseOnExceptions = (debugId, value) => {
  return ExtensionHostShared.executeProvider({
    event: `onDebug:${debugId}`,
    method: 'ExtensionHostDebug.setPauseOnExceptions',
    params: [debugId, value],
    noProviderFoundMessage: 'no debug provider found',
  })
}

export const start = (debugId) => {
  return ExtensionHostShared.executeProvider({
    event: `onDebug:${debugId}`,
    method: 'ExtensionHostDebug.start',
    params: [debugId],
    noProviderFoundMessage: 'no debug provider found',
  })
}

export const getProperties = (debugId, objectId) => {
  return ExtensionHostShared.executeProvider({
    event: `onDebug:${debugId}`,
    method: 'ExtensionHostDebug.getProperties',
    params: [debugId, objectId],
    noProviderFoundMessage: 'no debug provider found',
  })
}

export const evaluate = (debugId, expression, callFrameId) => {
  return ExtensionHostShared.executeProvider({
    event: `onDebug:${debugId}`,
    method: 'ExtensionHostDebug.evaluate',
    params: [debugId, expression, callFrameId],
    noProviderFoundMessage: 'no debug provider found',
  })
}
