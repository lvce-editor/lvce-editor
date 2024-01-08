import * as GetAboutVirtualDom from '../GetAboutVirtualDom/GetAboutVirtualDom.js'
import * as AboutStrings from '../AboutStrings/AboutStrings.js'

export const hasFunctionalRender = true

export const renderDialog = {
  isEqual(oldState, newState) {
    return oldState.productName === newState.productName && oldState.message === newState.message
  },
  apply(oldState, newState) {
    const okMessage = AboutStrings.ok()
    const copyMessage = AboutStrings.copy()
    const closeMessage = AboutStrings.close()
    const dom = GetAboutVirtualDom.getAboutVirtualDom(newState.productName, newState.message, closeMessage, okMessage, copyMessage)
    return ['setDom', dom]
  },
}

export const render = [renderDialog]
