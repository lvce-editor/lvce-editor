import * as Command from '../Command/Command.js'
import * as Credentials from './Credentials.js'

export const __initialize__ = () => {
  Command.register(801, Credentials.getPassword)
  Command.register(802, Credentials.setPassword)
  Command.register(803, Credentials.deletePassword)
  Command.register(804, Credentials.findPassword)
  Command.register(805, Credentials.findCredentials)
}
