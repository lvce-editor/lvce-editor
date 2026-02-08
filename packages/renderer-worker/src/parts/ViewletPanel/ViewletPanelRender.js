import { getPanelDom } from '../GetPanelDom/GetPanelDom.js'

export const hasFunctionalRender = true

export const hasFunctionalRootRender = true

export const hasFunctionalEvents = true

const renderDom = {
  isEqual(oldState, newState) {
    return false
  },
  apply(oldState, newState) {
    const dom = getPanelDom(newState)
    return [/* method */ 'Viewlet.setDom2', dom]
  },
}

export const render = [renderDom]
