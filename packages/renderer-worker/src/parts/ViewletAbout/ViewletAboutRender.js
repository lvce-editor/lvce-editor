import * as GetAboutVirtualDom from '../GetAboutVirtualDom/GetAboutVirtualDom.js'

export const hasFunctionalRender = true

export const renderDialog = {
  isEqual(oldState, newState) {
    return oldState === newState
  },
  apply(oldState, newState) {
    const dom = GetAboutVirtualDom.getAboutVirtualDom(newState.productName, newState.version)
    return ['setDom', dom]
  },
}

export const render = [renderDialog]
