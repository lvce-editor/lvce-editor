import * as DebugState from '../DebugState/DebugState.js'
import * as ViewletRunAndDebugStrings from '../ViewletRunAndDebug/ViewletRunAndDebugStrings.js'

export const getDebugButtons = (debugState) => {
  const debugButtons = []
  if (debugState === DebugState.Paused) {
    debugButtons.push({
      title: ViewletRunAndDebugStrings.resume(),
      icon: 'DebugContinue',
    })
  } else {
    debugButtons.push({
      title: ViewletRunAndDebugStrings.pause(),
      icon: 'DebugPause',
    })
  }
  debugButtons.push(
    {
      title: ViewletRunAndDebugStrings.stepOver(),
      icon: 'DebugStepOver',
    },
    {
      title: ViewletRunAndDebugStrings.stepInto(),
      icon: 'DebugStepInto',
    },
    {
      title: ViewletRunAndDebugStrings.stepOut(),
      icon: 'DebugStepOut',
    },
  )
  return debugButtons
}
