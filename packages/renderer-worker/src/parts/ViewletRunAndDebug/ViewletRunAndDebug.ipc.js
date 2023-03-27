import * as ViewletRunAndDebug from './ViewletRunAndDebug.js'

export const name = 'Run And Debug'

export const Events = {
  'Debug.paused': ViewletRunAndDebug.handlePaused,
  'Debug.resumed': ViewletRunAndDebug.handleResumed,
  'Debug.scriptParsed': ViewletRunAndDebug.handleScriptParsed,
}

export * from './ViewletRunAndDebug.js'
export * from './ViewletRunAndDebugCommands.js'
export * from './ViewletRunAndDebugCss.js'
export * from './ViewletRunAndDebugRender.js'
