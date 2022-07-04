import * as Command from '../Command/Command.js'
import * as Location from './Location.js'

export const __initialize__ = () => {
  Command.register('Location.getPathName', Location.getPathName)
  Command.register('Location.setPathName', Location.setPathName)
  Command.register('Location.hydrate', Location.hydrate)
}
