import * as Crash from './Crash.js'

export const name = 'Crash'

export const Commands = {
  crashSharedProcess: Crash.crashSharedProcess,
  crashMainProcess: Crash.crashMainProcess,
}
