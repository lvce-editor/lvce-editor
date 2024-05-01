import * as ExtensionHostDebug from '../ExtensionHost/ExtensionHostDebug.js'
import * as GlobalEventBus from '../GlobalEventBus/GlobalEventBus.js'

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

export const setPauseOnExceptions = (id, value) => {
  return ExtensionHostDebug.setPauseOnExceptions(id, value)
}
export const getProperties = (id, objectId) => {
  return ExtensionHostDebug.getProperties(id, objectId)
}

export const evaluate = (id, expression, callFrameId) => {
  return ExtensionHostDebug.evaluate(id, expression, callFrameId)
}

export const scriptParsed = (script) => {
  GlobalEventBus.emitEvent('Debug.scriptParsed', script)
}

export const paused = (params) => {
  GlobalEventBus.emitEvent('Debug.paused', params)
}

export const resumed = (params) => {
  GlobalEventBus.emitEvent('Debug.resumed', params)
}
