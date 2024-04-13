import * as DebugState from '../DebugState/DebugState.js'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.js'
import * as ViewletRunAndDebugStrings from '../ViewletRunAndDebug/ViewletRunAndDebugStrings.js'

export const getDebugButtons = (debugState) => {
  const debugButtons = []
  if (debugState === DebugState.Paused) {
    debugButtons.push({
      title: ViewletRunAndDebugStrings.resume(),
      icon: 'DebugContinue',
      fn: DomEventListenerFunctions.HandleClickContinue,
    })
  } else {
    debugButtons.push({
      title: ViewletRunAndDebugStrings.pause(),
      icon: 'DebugPause',
      fn: DomEventListenerFunctions.HandleClickPause,
    })
  }
  debugButtons.push(
    {
      title: ViewletRunAndDebugStrings.stepOver(),
      icon: 'DebugStepOver',
      fn: DomEventListenerFunctions.HandleClickStepOver,
    },
    {
      title: ViewletRunAndDebugStrings.stepInto(),
      icon: 'DebugStepInto',
      fn: DomEventListenerFunctions.HandleClickStepInto,
    },
    {
      title: ViewletRunAndDebugStrings.stepOut(),
      icon: 'DebugStepOut',
      fn: DomEventListenerFunctions.HandleClickStepOut,
    },
    {
      title: ViewletRunAndDebugStrings.restart(),
      icon: 'DebugRestart',
      fn: DomEventListenerFunctions.HandleClickRestart,
    },
    {
      title: ViewletRunAndDebugStrings.stop(),
      icon: 'DebugStop',
      fn: DomEventListenerFunctions.HandleClickStop,
    },
  )
  return debugButtons
}
