import * as Command from '../Command/Command.js'
import * as ErrorHandling from './ErrorHandling.js'

export const __initialize__ = () => {
  Command.register(440, ErrorHandling.handleError)
}
