import * as Command from '../Command/Command.js'
import * as Listener from './Listener.js'


export const __initialize__ = () => {
  Command.register(3444, Listener.execute)
}
