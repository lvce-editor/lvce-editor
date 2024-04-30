import * as ViewletRunAndDebug from './ViewletRunAndDebug.js'

// prettier-ignore
export const Commands = {
  continue: ViewletRunAndDebug.resume,
  handleClickScopeValue: ViewletRunAndDebug.handleClickScopeValue,
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
  handleArrowLeft: ViewletRunAndDebug.handleArrowLeft,
  handleArrowUp: ViewletRunAndDebug.handleArrowUp,
  handleArrowDown: ViewletRunAndDebug.handleArrowDown,
  handleArrowRight: ViewletRunAndDebug.handleArrowRight,
  focusPrevious: ViewletRunAndDebug.focusPrevious,
  focusNext: ViewletRunAndDebug.focusNext,
}
