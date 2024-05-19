import * as GetAboutVirtualDom from '../GetAboutVirtualDom/GetAboutVirtualDom.js'
import * as AboutStrings from '../AboutStrings/AboutStrings.js'
import * as AboutFocusId from '../AboutFocusId/AboutFocusId.js'

export const hasFunctionalRender = true

export const hasFunctionalRootRender = true

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
    return ['Viewlet.setDom2', dom]
  },
}

const getFocusSelector = (focusId) => {
  switch (focusId) {
    case AboutFocusId.Copy:
      return '.ButtonPrimary'
    case AboutFocusId.Ok:
      return '.ButtonSecondary'
    default:
      return ''
  }
}

export const renderFocus = {
  isEqual(oldState, newState) {
    return oldState.focusId === newState.focusId
  },
  apply(oldState, newState) {
    const selector = getFocusSelector(newState.focusId)
    return ['setFocused', selector]
  },
}

export const render = [renderDialog, renderFocus]
