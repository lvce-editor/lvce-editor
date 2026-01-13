import * as Command from '../Command/Command.js'
import { executeCallback2, registerCallback } from '../QuickPickEntriesCustom/QuickPickEntriesCustom.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'

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

export const showCustom = async (picks, options) => {
  const { callbackId, promise } = registerCallback()
  await show('custom', picks, callbackId, options)
  if (options?.waitUntil === 'visible') {
    return
  }
  return promise
}

export const executeCallback = (callbackId, ...args) => {
  return executeCallback2(callbackId, ...args)
}
