import * as ViewletRunAndDebug from './ViewletRunAndDebug.js'

export const name = 'Run And Debug'

// prettier-ignore
export const Commands = {
  continue: ViewletRunAndDebug.resume,
  resume: ViewletRunAndDebug.resume,
  pause: ViewletRunAndDebug.pause,
  stepOver: ViewletRunAndDebug.stepOver,
  stepInto: ViewletRunAndDebug.stepInto,
  stepOut: ViewletRunAndDebug.stepOut,
  handleClickSectionWatch: ViewletRunAndDebug.handleClickSectionWatch,
  handleClickSectionBreakPoints: ViewletRunAndDebug.handleClickSectionBreakPoints,
  handleClickSectionScope: ViewletRunAndDebug.handleClickSectionScope,
  handleClickSectionCallstack: ViewletRunAndDebug.handleClickSectionCallstack,
}

export const Events = {
  'Debug.paused': ViewletRunAndDebug.handlePaused,
  'Debug.resumed': ViewletRunAndDebug.handleResumed,
}

export const Css = [
  '/css/parts/MaskIcon.css',
  '/css/parts/ViewletRunAndDebug.css',
]

export * from './ViewletRunAndDebug.js'
