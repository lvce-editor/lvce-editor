import * as ViewletRunAndDebug from './ViewletRunAndDebug.js'

export const Events = {
  'Debug.scriptParsed': ViewletRunAndDebug.handleScriptParsed,
  // 'Debug.paused': ViewletRunAndDebug.handlePaused,
  'Debug.resumed': ViewletRunAndDebug.handleResumed,
}
