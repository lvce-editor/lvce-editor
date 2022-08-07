import * as Command from '../Command/Command.js'
import * as ViewletLocations from './ViewletLocations.js'
import * as Viewlet from '../Viewlet/Viewlet.js'

// prettier-ignore
export const __initialize__ = () => {
  Command.register('Locations.selectIndex', Viewlet.wrapViewletCommand('Locations', ViewletLocations.selectIndex))
  Command.register('Locations.focusFirst', Viewlet.wrapViewletCommand('Locations', ViewletLocations.focusFirst))
  Command.register('Locations.focusLast', Viewlet.wrapViewletCommand('Locations', ViewletLocations.focusLast))
  Command.register('Locations.focusNext', Viewlet.wrapViewletCommand('Locations', ViewletLocations.focusNext))
  Command.register('Locations.focusPrevious', Viewlet.wrapViewletCommand('Locations', ViewletLocations.focusPrevious))
  Command.register('Locations.selectCurrent', Viewlet.wrapViewletCommand('Locations', ViewletLocations.selectCurrent))
  Command.register('Locations.focusIndex', Viewlet.wrapViewletCommand('Locations', ViewletLocations.focusIndex))
}
