import * as Command from '../Command/Command.js'
import * as Process from './Process.js'

export const __initialize__ = () => {
  Command.register(555, Process.crash)
  Command.register(556, Process.crashAsync)
}
