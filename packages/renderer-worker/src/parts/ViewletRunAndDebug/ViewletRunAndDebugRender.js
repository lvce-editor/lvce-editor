import * as GetRunAndDebugVirtualDom2 from '../GetRunAndDebugVirtualDom2/GetRunAndDebugVirtualDom2.ts'
import * as GetRunAndDebugVisibleRows from '../GetRunAndDebugVisibleRows/GetRunAndDebugVisibleRows.ts'

export const hasFunctionalRender = true

export const hasFunctionalRootRender = true

const renderDebug = {
  isEqual(oldState, newState) {
    return false
  },
  apply(oldState, newState) {
    const rows = GetRunAndDebugVisibleRows.getRunAndDebugVisibleRows(newState)
    const dom = GetRunAndDebugVirtualDom2.getRunAndDebugVirtualDom2(rows)
    return ['Viewlet.setDom2', dom]
  },
}

export const render = [renderDebug]
