import * as ViewletRunAndDebug from './ViewletRunAndDebug.js'

// prettier-ignore
export const Commands = {
  continue: ViewletRunAndDebug.resume,
  handleClickSectionBreakPoints: ViewletRunAndDebug.handleClickSectionBreakPoints,
  handleClickSectionCallstack: ViewletRunAndDebug.handleClickSectionCallstack,
  handleClickSectionScope: ViewletRunAndDebug.handleClickSectionScope,
  handleClickSectionWatch: ViewletRunAndDebug.handleClickSectionWatch,
  handleDebugInput: ViewletRunAndDebug.handleDebugInput,
  handleEvaluate: ViewletRunAndDebug.handleEvaluate,
  pause: ViewletRunAndDebug.pause,
  resume: ViewletRunAndDebug.resume,
  stepInto: ViewletRunAndDebug.stepInto,
  stepOut: ViewletRunAndDebug.stepOut,
  stepOver: ViewletRunAndDebug.stepOver,
  togglePause: ViewletRunAndDebug.togglePause,
}
