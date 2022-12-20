import * as Assert from '../Assert/Assert.js'
import * as ExtensionHostShared from './ExtensionHostShared.js'

export const listProcesses = async (debugId) => {
  const processes = await ExtensionHostShared.executeProvider({
    event: `onDebug`,
    method: 'ExtensionHostDebug.listProcesses',
    params: [debugId],
    noProviderFoundMessage: 'no debug provider found',
  })
  Assert.array(processes)
  return processes
}

export const resume = async (debugId) => {
  await ExtensionHostShared.executeProvider({
    event: `onDebug`,
    method: 'ExtensionHostDebug.resume',
    params: [debugId],
    noProviderFoundMessage: 'no debug provider found',
  })
}

export const pause = async (debugId) => {
  await ExtensionHostShared.executeProvider({
    event: `onDebug`,
    method: 'ExtensionHostDebug.pause',
    params: [debugId],
    noProviderFoundMessage: 'no debug provider found',
  })
}

export const stepOver = async (debugId) => {
  await ExtensionHostShared.executeProvider({
    event: `onDebug`,
    method: 'ExtensionHostDebug.stepOver',
    params: [debugId],
    noProviderFoundMessage: 'no debug provider found',
  })
}

export const stepInto = async (debugId) => {
  await ExtensionHostShared.executeProvider({
    event: `onDebug`,
    method: 'ExtensionHostDebug.stepInto',
    params: [debugId],
    noProviderFoundMessage: 'no debug provider found',
  })
}

export const stepOut = async (debugId) => {
  await ExtensionHostShared.executeProvider({
    event: `onDebug`,
    method: 'ExtensionHostDebug.stepOut',
    params: [debugId],
    noProviderFoundMessage: 'no debug provider found',
  })
}

export const step = async (debugId) => {
  await ExtensionHostShared.executeProvider({
    event: `onDebug`,
    method: 'ExtensionHostDebug.step',
    params: [debugId],
    noProviderFoundMessage: 'no debug provider found',
  })
}

export const setPauseOnExceptions = async (debugId, value) => {
  await ExtensionHostShared.executeProvider({
    event: `onDebug`,
    method: 'ExtensionHostDebug.setPauseOnExceptions',
    params: [debugId, value],
    noProviderFoundMessage: 'no debug provider found',
  })
}

export const start = async (debugId) => {
  await ExtensionHostShared.executeProvider({
    event: `onDebug`,
    method: 'ExtensionHostDebug.start',
    params: [debugId],
    noProviderFoundMessage: 'no debug provider found',
  })
}
