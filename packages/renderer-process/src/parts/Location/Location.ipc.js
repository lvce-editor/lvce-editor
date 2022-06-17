import * as Command from '../Command/Command.js'
import * as Location from './Location.js'

export const __initialize__ = () => {
  Command.register(5611, Location.getPathName)
  Command.register(5612, Location.setPathName)
  Command.register(5613, Location.hydrate)
}
