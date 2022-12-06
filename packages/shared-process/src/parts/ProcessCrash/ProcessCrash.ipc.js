import * as ProcessCrash from './ProcessCrash.js'

export const name = 'ProcessCrash'

export const Commands = {
  crash: ProcessCrash.crash,
  crashAsync: ProcessCrash.crashAsync,
}
