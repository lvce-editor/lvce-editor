import { getSideBarDom } from '../GetSideBarDom/GetSideBarDom.js'
import * as RenderMethod from '../RenderMethod/RenderMethod.js'

export const hasFunctionalRender = true
export const hasFunctionalRootRender = true

const renderTitle = {
  isEqual(oldState, newState) {
    return false
  },
  apply(oldState, newState) {
    return [/* method */ RenderMethod.SetTitle, /* name */ newState.title || newState.currentViewletId]
  },
}
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
