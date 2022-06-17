import * as Command from '../Command/Command.js'
import * as Terminal from './Terminal.js'

export const __initialize__ = () => {
  Command.register(8881, Terminal.write)
}
