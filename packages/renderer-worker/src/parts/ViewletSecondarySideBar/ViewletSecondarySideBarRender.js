import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'

export const hasFunctionalRender = true

export const hasFunctionalRootRender = true

export const hasFunctionalEvents = true

export const hasFunctionalResize = true

const renderDom = {
  isEqual(oldState, newState) {
    return oldState.currentViewletId === newState.currentViewletId
  },
  apply(oldState, newState) {
    const { childUid } = newState
    const dom = [
      {
        type: VirtualDomElements.Div,
        className: 'SideBar SecondarySideBar',
        childCount: 1,
      },
      {
        type: VirtualDomElements.Reference,
        uid: childUid,
      },
    ]
    return [/* method */ 'Viewlet.setDom2', dom]
  },
}

export const render = [renderDom]
