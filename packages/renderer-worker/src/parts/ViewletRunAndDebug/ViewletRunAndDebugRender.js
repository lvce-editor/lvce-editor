import * as DiffDom from '../DiffDom/DiffDom.js'
import * as GetRunAndDebugVirtualDom from '../GetRunAndDebugVirtualDom/GetRunAndDebugVirtualDom.js'

let first = true

const renderDebug = {
  isEqual(oldState, newState) {
    return false
  },
  apply(oldState, newState) {
    console.log(newState.scopeChain)
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

export const render = [renderDebug]
