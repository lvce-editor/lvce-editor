import * as Command from '../Command/Command.js'
import * as ViewletLocations from './ViewletLocations.js'
import * as Viewlet from './Viewlet.js'

export const __initialize__ = () => {
  Command.register(7100, Viewlet.wrapViewletCommand('Locations', ViewletLocations.selectIndex))
  Command.register(7101, Viewlet.wrapViewletCommand('Locations', ViewletLocations.focusFirst))
  Command.register(7102, Viewlet.wrapViewletCommand('Locations', ViewletLocations.focusLast))
  Command.register(7103, Viewlet.wrapViewletCommand('Locations', ViewletLocations.focusNext))
  Command.register(7104, Viewlet.wrapViewletCommand('Locations', ViewletLocations.focusPrevious))
  Command.register(7105, Viewlet.wrapViewletCommand('Locations', ViewletLocations.selectCurrent))
  Command.register(7106, Viewlet.wrapViewletCommand('Locations', ViewletLocations.focusIndex))
}
