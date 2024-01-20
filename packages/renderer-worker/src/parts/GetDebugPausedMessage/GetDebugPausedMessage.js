import * as DebugPauseReason from '../DebugPausedReason/DebugPausedReason.js'
import * as DebugStrings from '../DebugStrings/DebugStrings.js'

export const getDebugPausedMessage = (reason) => {
  switch (reason) {
    case DebugPauseReason.Other:
      return DebugStrings.debuggerPaused()
    case DebugPauseReason.Exception:
      return DebugStrings.debuggerPausedOnException()
    default:
      return `Debugger paused (${reason})`
  }
}
