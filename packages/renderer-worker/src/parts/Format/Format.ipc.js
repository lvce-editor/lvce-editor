import * as Command from '../Command/Command.js'
import * as Format from './Format.js'

export const __initialize__ = () => {
  Command.register('Format.hydrate', Format.hydrate)
}
