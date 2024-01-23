import * as DiffDom from '../DiffDom/DiffDom.js'
import * as GetRunAndDebugVirtualDom from '../GetRunAndDebugVirtualDom/GetRunAndDebugVirtualDom.js'
import * as GetRunAndDebugButtonsVirtualDom from '../GetRunAndDebugButtonsVirtualDom/GetRunAndDebugButtonsVirtualDom.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'
import * as ViewletStates from '../ViewletStates/ViewletStates.js'

let first = true

const renderDebug = {
  isEqual(oldState, newState) {
    return false
  },
  apply(oldState, newState) {
    const oldDom = GetRunAndDebugVirtualDom.getRunAndDebugVirtualDom(oldState)
    const newDom = GetRunAndDebugVirtualDom.getRunAndDebugVirtualDom(newState)
    // console.log({ oldDom, newDom })
    const diff = DiffDom.diffDom(oldDom, newDom)
    // console.log({ diff })
    // if (first) {
    //   first = false
    return ['setDom', newDom]
    // }
    // return ['setPatches', diff]
  },
}

// TODO this component shouldn't depend on Main
const renderActions = {
  isEqual(oldState, newState) {
    return oldState.debugState === newState.debugState
  },
  apply(oldState, newState) {
    const dom = GetRunAndDebugButtonsVirtualDom.getRunAndDebugButtonsVirtualDom(newState.debugState)
    return ['Viewlet.send', ViewletModuleId.SideBar, 'setActionsDom', ViewletModuleId.RunAndDebug, dom]
  },
}

export const render = [renderDebug, renderActions]
