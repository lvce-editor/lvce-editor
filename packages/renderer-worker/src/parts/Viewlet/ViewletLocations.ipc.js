import * as Command from '../Command/Command.js'
import * as ViewletLocations from './ViewletLocations.js'
import * as Viewlet from './Viewlet.js'

// prettier-ignore
export const __initialize__ = () => {
  Command.register('ViewletLocations.selectIndex', Viewlet.wrapViewletCommand('Locations', ViewletLocations.selectIndex))
  Command.register('ViewletLocations.focusFirst', Viewlet.wrapViewletCommand('Locations', ViewletLocations.focusFirst))
  Command.register('ViewletLocations.focusLast', Viewlet.wrapViewletCommand('Locations', ViewletLocations.focusLast))
  Command.register('ViewletLocations.focusNext', Viewlet.wrapViewletCommand('Locations', ViewletLocations.focusNext))
  Command.register('ViewletLocations.focusPrevious', Viewlet.wrapViewletCommand('Locations', ViewletLocations.focusPrevious))
  Command.register('ViewletLocations.selectCurrent', Viewlet.wrapViewletCommand('Locations', ViewletLocations.selectCurrent))
  Command.register('ViewletLocations.focusIndex', Viewlet.wrapViewletCommand('Locations', ViewletLocations.focusIndex))
}
