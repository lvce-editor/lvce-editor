import * as DiffDom from '../DiffDom/DiffDom.js'
import * as GetRunAndDebugVirtualDom from '../GetRunAndDebugVirtualDom/GetRunAndDebugVirtualDom.js'

const first = true

const renderDebug = {
  isEqual(oldState, newState) {
    return false
  },
  apply(oldState, newState) {
    const oldDom = GetRunAndDebugVirtualDom.getRunAndDebugVirtualDom(oldState)
    const newDom = GetRunAndDebugVirtualDom.getRunAndDebugVirtualDom(newState)
    const diff = DiffDom.diffDom(oldDom, newDom)
    return ['Viewlet.setDom', newDom]
  },
}

export const render = [renderDebug]
