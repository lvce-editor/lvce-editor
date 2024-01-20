import * as DebugPauseReason from '../DebugPausedReason/DebugPausedReason.js'
import * as DebugScopeType from '../DebugScopeType/DebugScopeType.js'
import * as DebugStrings from '../DebugStrings/DebugStrings.js'

export const getScopeLabel = (element) => {
  switch (element.type) {
    case DebugScopeType.Local:
      return DebugStrings.local()
    case DebugScopeType.Closure:
      if (element.name) {
        return DebugStrings.namedClosure(element.name)
      }
      return DebugStrings.closure()
    case DebugScopeType.Global:
      return DebugStrings.global()
    case DebugScopeType.Block:
      return DebugStrings.block()
    case DebugScopeType.WasmExpressionStack:
      return DebugStrings.expression()
    case DebugScopeType.Module:
      return DebugStrings.module()
    case DebugScopeType.Eval:
      return DebugStrings.evalScope()
    case DebugScopeType.Script:
      return DebugStrings.script()
    case DebugScopeType.With:
      return DebugStrings.withScope()
    case DebugScopeType.Catch:
      return DebugStrings.catchScope()
    default:
      return element.type
  }
}

export const getPausedMessage = (reason) => {
  switch (reason) {
    case DebugPauseReason.Other:
      return DebugStrings.debuggerPaused()
    case DebugPauseReason.Exception:
      return DebugStrings.debuggerPausedOnException()
    default:
      return `Debugger paused (${reason})`
  }
}
