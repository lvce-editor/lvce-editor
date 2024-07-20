import * as AboutFocusId from '../AboutFocusId/AboutFocusId.js'
import * as AboutStrings from '../AboutStrings/AboutStrings.js'
import * as GetAboutVirtualDom from '../GetAboutVirtualDom/GetAboutVirtualDom.js'
import { AboutState } from './ViewletAboutTypes.ts'

export const hasFunctionalRender = true

export const hasFunctionalRootRender = true

export const renderDialog = {
  isEqual(oldState: AboutState, newState: AboutState) {
    return oldState.productName === newState.productName && oldState.lines === newState.lines
  },
  apply(oldState: AboutState, newState: AboutState) {
    const okMessage = AboutStrings.ok()
    const copyMessage = AboutStrings.copy()
    const closeMessage = AboutStrings.closeDialog()
    const infoMessage = AboutStrings.info()
    const dom = GetAboutVirtualDom.getAboutVirtualDom(newState.productName, newState.lines, closeMessage, okMessage, copyMessage, infoMessage)
    return ['Viewlet.setDom2', dom]
  },
}

const getFocusSelector = (focusId: number) => {
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
  isEqual(oldState: AboutState, newState: AboutState) {
    return oldState.focusId === newState.focusId
  },
  apply(oldState: AboutState, newState: AboutState) {
    const selector = getFocusSelector(newState.focusId)
    return ['setFocused', selector]
  },
}

export const render = [renderDialog, renderFocus]
