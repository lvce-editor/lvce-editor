import * as Command from '../Command/Command.js'
import * as Format from './Format.js'

export const __initialize__ = () => {
  Command.register(3380, Format.hydrate)
}
