import * as Command from '../Command/Command.js'
import * as Base64 from './Base64.js'

export const __initialize__ = () => {
  Command.register(7890, Base64.decode)
}
