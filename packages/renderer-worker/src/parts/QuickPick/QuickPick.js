import * as Command from '../Command/Command.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'
import * as Id from '../Id/Id.js'
import { executeCallback2, registerCallback } from '../QuickPickEntriesCustom/QuickPickEntriesCustom.js'

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

export const showCustom = async (picks) => {
  const { callbackId, promise } = registerCallback()
  await show('custom', picks, callbackId)
  return promise
}

export const executeCallback = (callbackId, ...args) => {
  return executeCallback2(callbackId, ...args)
}
