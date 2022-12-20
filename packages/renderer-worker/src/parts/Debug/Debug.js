import * as ExtensionHostDebug from '../ExtensionHost/ExtensionHostDebug.js'

export const create = (debugId) => {
  return {
    debugId,
  }
}

export const start = (id) => {
  return ExtensionHostDebug.start(id)
}

export const listProcesses = (id) => {
  return ExtensionHostDebug.listProcesses(id)
}

export const resume = (id) => {
  return ExtensionHostDebug.resume(id)
}

export const pause = (id) => {
  return ExtensionHostDebug.pause(id)
}

export const stepOver = (id) => {
  return ExtensionHostDebug.stepOver(id)
}

export const stepInto = (id) => {
  return ExtensionHostDebug.stepInto(id)
}

export const stepOut = (id) => {
  return ExtensionHostDebug.stepOut(id)
}

export const step = (id) => {
  return ExtensionHostDebug.step(id)
}

export const setPauseOnExceptions = (id) => {
  return ExtensionHostDebug.setPauseOnExceptions(id, 'all')
}
