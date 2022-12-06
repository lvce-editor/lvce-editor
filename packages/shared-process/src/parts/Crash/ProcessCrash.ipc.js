import * as Crash from './ProcessCrash.js/index.js.js'

export const name = 'Crash'

export const Commands = {
  crash: Crash.crash,
  crashAsync: Crash.crashAsync,
}
