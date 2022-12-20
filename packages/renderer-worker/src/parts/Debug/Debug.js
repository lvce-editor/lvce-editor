import * as Command from '../Command/Command.js'
import * as ExtensionHostDebug from '../ExtensionHost/ExtensionHostDebug.js'

export const create = (debugId) => {
  Command.register('Debug.paused')
  return {
    debugId,
  }
}

export const start = (id) => {
  return ExtensionHostDebug.start(id)
}

export const listProcesses = async (id) => {
  return ExtensionHostDebug.listProcesses(id)
}

export const resume = async (id) => {
  return ExtensionHostDebug.resume(id)
}

export const pause = async (id) => {
  return ExtensionHostDebug.pause(id)
}

export const setPauseOnExceptions = (id) => {
  return ExtensionHostDebug.setPauseOnExceptions(id, 'all')
}
