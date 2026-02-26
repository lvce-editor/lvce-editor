import { getSideBarDom } from '../GetSideBarDom/GetSideBarDom.js'

export const hasFunctionalRender = true

export const hasFunctionalRootRender = true

export const hasFunctionalEvents = true

export const hasFunctionalResize = true

const renderDom = {
  isEqual(oldState, newState) {
    return false
  },
  apply(oldState, newState) {
    const dom = getSideBarDom(newState)
    return [/* method */ 'Viewlet.setDom2', dom]
  },
}

export const render = [renderDom]
