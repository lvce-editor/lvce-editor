import { boardViewId } from '../BoardLayout/BoardLayout.js'
import * as Command from '../Command/Command.js'
import { executeCallback2, registerCallback } from '../QuickPickEntriesCustom/QuickPickEntriesCustom.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'
import * as ViewletStates from '../ViewletStates/ViewletStates.js'

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

export const openGoToLine = () => {
  return show('go-to-line')
}

export const showEveryThing = () => {
  let useChatSearch = false
  try {
    const { aiNativeLayout, sideBarView } = ViewletStates.getState(ViewletModuleId.Layout)
    useChatSearch = aiNativeLayout === true && sideBarView !== boardViewId
  } catch {
    // Layout state may not be initialized when quick pick is first opened.
  }
  return show(useChatSearch ? 'chats' : 'everything')
}

export const showColorTheme = () => {
  return show('color-theme')
}

export const showCommands = () => {
  return show('commands')
}

export const showCustom = async (picks, options, applicationId) => {
  const { callbackId, promise } = registerCallback()
  if (applicationId === undefined) {
    await show('custom', picks, callbackId, options)
  } else {
    await Viewlet.openWidgetForApplication(applicationId, ViewletModuleId.QuickPick, 'custom', picks, callbackId, options)
  }
  if (options?.waitUntil === 'visible') {
    return
  }
  return promise
}

export const executeCallback = (callbackId, ...args) => {
  return executeCallback2(callbackId, ...args)
}
