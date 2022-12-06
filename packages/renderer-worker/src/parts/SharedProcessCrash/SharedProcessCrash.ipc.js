import * as SharedProcessCrash from './SharedProcessCrash.js'

export const name = 'SharedProcessCrash'

// prettier-ignore
export const Commands = {
  crash: SharedProcessCrash.crash,
  crashAsync: SharedProcessCrash.crashAsync,
}
