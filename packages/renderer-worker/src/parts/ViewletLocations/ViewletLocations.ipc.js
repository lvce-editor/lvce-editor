import * as Viewlet from '../Viewlet/Viewlet.js'
import * as ViewletLocations from './ViewletLocations.js'

// prettier-ignore
export const Commands = {
  'Locations.focusFirst': Viewlet.wrapViewletCommand(ViewletLocations.name, ViewletLocations.focusFirst),
  'Locations.focusIndex': Viewlet.wrapViewletCommand(ViewletLocations.name, ViewletLocations.focusIndex),
  'Locations.focusLast': Viewlet.wrapViewletCommand(ViewletLocations.name, ViewletLocations.focusLast),
  'Locations.focusNext': Viewlet.wrapViewletCommand(ViewletLocations.name, ViewletLocations.focusNext),
  'Locations.focusPrevious': Viewlet.wrapViewletCommand(ViewletLocations.name, ViewletLocations.focusPrevious),
  'Locations.selectCurrent': Viewlet.wrapViewletCommand(ViewletLocations.name, ViewletLocations.selectCurrent),
  'Locations.selectIndex': Viewlet.wrapViewletCommand(ViewletLocations.name, ViewletLocations.selectIndex),
}
