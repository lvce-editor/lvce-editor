import * as GetAboutVirtualDom from '../GetAboutVirtualDom/GetAboutVirtualDom.js'

export const hasFunctionalRender = true

export const renderDialog = {
  isEqual(oldState, newState) {
    return oldState.productName === newState.productName && oldState.message === newState.message
  },
  apply(oldState, newState) {
    const dom = GetAboutVirtualDom.getAboutVirtualDom(newState.productName, newState.message)
    return ['setDom', dom]
  },
}

export const render = [renderDialog]
