import * as ViewletRunAndDebug from './ViewletRunAndDebug.js'

export const name = 'Run And Debug'

export const Commands = {
  continue: ViewletRunAndDebug.continue_,
  pause: ViewletRunAndDebug.pause,
}

export const Css = '/css/parts/ViewletRunAndDebug.css'

export * from './ViewletRunAndDebug.js'
