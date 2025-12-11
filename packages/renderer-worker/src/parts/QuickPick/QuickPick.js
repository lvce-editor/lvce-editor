import * as Command from '../Command/Command.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'
import * as Id from '../Id/Id.js'

export const show = async (...args) => {
  // TODO show custom quickpick
  await Command.execute('Viewlet.openWidget', ViewletModuleId.QuickPick, ...args)
  return undefined
}

export const showFile = () => {
  return show('file')
}

export const showRecent = () => {
  return show('recent')
}

export const showEveryThing = () => {
  return show('everything')
}

export const showColorTheme = () => {
  return show('color-theme')
}

export const showCommands = () => {
  return show('commands')
}

const callbackMap = Object.create(null)

export const showCustom = async (picks) => {
  const { resolve, promise } = Promise.withResolvers()
  const callbackId = Id.create()
  callbackMap[callbackId] = resolve
  await show('custom', picks, callbackId)
  return promise
}

export const executeCallback = (callbackId, ...args) => {
  const fn = callbackMap[callbackId]
  delete callbackMap[callbackId]
  return fn(...args)
}
