import * as GetAboutVirtualDom from '../GetAboutVirtualDom/GetAboutVirtualDom.js'
import * as AboutStrings from '../AboutStrings/AboutStrings.js'

export const hasFunctionalRender = true

export const renderDialog = {
  isEqual(oldState, newState) {
    return oldState.productName === newState.productName && oldState.lines === newState.lines
  },
  apply(oldState, newState) {
    const okMessage = AboutStrings.ok()
    const copyMessage = AboutStrings.copy()
    const closeMessage = AboutStrings.closeDialog()
    const infoMessage = AboutStrings.info()
    const dom = GetAboutVirtualDom.getAboutVirtualDom(newState.productName, newState.lines, closeMessage, okMessage, copyMessage, infoMessage)
    return ['Viewlet.setDom', dom]
  },
}

export const renderFocus = {
  isEqual(oldState, newState) {
    return oldState.focused === newState.focused
  },
  apply(oldState, newState) {
    return ['setFocused', newState.focused]
  },
}

export const render = [renderDialog, renderFocus]
