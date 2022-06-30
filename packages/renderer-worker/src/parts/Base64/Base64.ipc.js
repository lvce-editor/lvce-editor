import * as Command from '../Command/Command.js'
import * as Base64 from './Base64.js'

export const __initialize__ = () => {
  Command.register('Base64.decode', Base64.decode)
}
