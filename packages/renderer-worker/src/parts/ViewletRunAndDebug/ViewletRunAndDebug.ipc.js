import * as ViewletRunAndDebug from './ViewletRunAndDebug.js'

export const name = 'Run And Debug'

export const Commands = {
  continue: ViewletRunAndDebug.resume,
  resume: ViewletRunAndDebug.resume,
  pause: ViewletRunAndDebug.pause,
}

export const Events = {
  'Debug.paused': ViewletRunAndDebug.handlePaused,
  'Debug.resumed': ViewletRunAndDebug.handleResumed,
}

export const Css = '/css/parts/ViewletRunAndDebug.css'

export * from './ViewletRunAndDebug.js'
