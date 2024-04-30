import * as DiffDom from '../DiffDom/DiffDom.js'
import * as GetRunAndDebugVirtualDom from '../GetRunAndDebugVirtualDom/GetRunAndDebugVirtualDom.js'

export const hasFunctionalRender = true

export const hasFunctionalRootRender = true

const renderDebug = {
  isEqual(oldState, newState) {
    return false
  },
  apply(oldState, newState) {
    const oldDom = GetRunAndDebugVirtualDom.getRunAndDebugVirtualDom(oldState)
    const newDom = GetRunAndDebugVirtualDom.getRunAndDebugVirtualDom(newState)
    const diff = DiffDom.diffDom(oldDom, newDom)
    return ['Viewlet.setDom2', newDom]
  },
}

export const render = [renderDebug]
