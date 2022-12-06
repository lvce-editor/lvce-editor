import * as ElectronProcessCrash from './ElectronProcessCrash.js'

export const name = 'ElectronProcessCrash'

// prettier-ignore
export const Commands = {
  crash: ElectronProcessCrash.crash,
  crashAsync: ElectronProcessCrash.crashAsync,
}
