import * as Viewlet from '../Viewlet/Viewlet.js'
import * as ViewletLocations from './ViewletLocations.js'

// prettier-ignore
export const Commands = {
  'Locations.focusFirst': Viewlet.wrapViewletCommand('Locations', ViewletLocations.focusFirst),
  'Locations.focusIndex': Viewlet.wrapViewletCommand('Locations', ViewletLocations.focusIndex),
  'Locations.focusLast': Viewlet.wrapViewletCommand('Locations', ViewletLocations.focusLast),
  'Locations.focusNext': Viewlet.wrapViewletCommand('Locations', ViewletLocations.focusNext),
  'Locations.focusPrevious': Viewlet.wrapViewletCommand('Locations', ViewletLocations.focusPrevious),
  'Locations.selectCurrent': Viewlet.wrapViewletCommand('Locations', ViewletLocations.selectCurrent),
  'Locations.selectIndex': Viewlet.wrapViewletCommand('Locations', ViewletLocations.selectIndex),
}
