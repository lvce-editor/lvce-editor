import * as DebugState from '../DebugState/DebugState.js'
import * as ViewletRunAndDebugStrings from '../ViewletRunAndDebug/ViewletRunAndDebugStrings.js'

export const getDebugButtons = (debugState) => {
  const debugButtons = []
  if (debugState === DebugState.Paused) {
    debugButtons.push({
      title: ViewletRunAndDebugStrings.resume(),
      icon: 'DebugContinue',
      fn: 'handleClickContinue',
    })
  } else {
    debugButtons.push({
      title: ViewletRunAndDebugStrings.pause(),
      icon: 'DebugPause',
      fn: 'handleClickPause',
    })
  }
  debugButtons.push(
    {
      title: ViewletRunAndDebugStrings.stepOver(),
      icon: 'DebugStepOver',
      fn: 'handleClickStepOver',
    },
    {
      title: ViewletRunAndDebugStrings.stepInto(),
      icon: 'DebugStepInto',
      fn: 'handleClickStepInto',
    },
    {
      title: ViewletRunAndDebugStrings.stepOut(),
      icon: 'DebugStepOut',
      fn: 'handleClickStepOut',
    },
    {
      title: ViewletRunAndDebugStrings.restart(),
      icon: 'DebugRestart',
      fn: 'handleClickRestart',
    },
    {
      title: ViewletRunAndDebugStrings.stop(),
      icon: 'DebugStop',
      fn: 'handleClickStop',
    },
  )
  return debugButtons
}
