import * as AriaRoles from '../AriaRoles/AriaRoles.js'
import * as ClassNames from '../ClassNames/ClassNames.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import * as LocationType from '../LocationType/LocationType.js'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.js'

const getLocationVirtualDom = (location) => {
  const { type, icon, lineText, index, name } = location
  switch (type) {
    case LocationType.Leaf:
      return [
        {
          type: VirtualDomElements.Div,
          className: ClassNames.TreeItem,
          id: `Reference-${index}`,
          childCount: 1,
        },
        text(lineText || '(empty line)'),
      ]
    case LocationType.Collapsed:
      return [
        {
          type: VirtualDomElements.Div,
          className: ClassNames.TreeItem,
          ariaExpanded: false,
          id: `Reference-${index}`,
          childCount: 1,
        },
        text(name),
      ]
    case LocationType.Expanded:
      return [
        {
          type: VirtualDomElements.Div,
          className: ClassNames.TreeItem,
          ariaExpanded: true,
          id: `Reference-${index}`,
          childCount: 1,
        },
        text(name),
      ]
    default:
      return []
  }
}

export const getLocationsVirtualDom = (locations, message) => {
  const dom = []
  dom.push(
    {
      type: VirtualDomElements.Div,
      className: ClassNames.LocationsMessage,
      id: 'LocationsMessage',
      role: AriaRoles.Status,
      childCount: 1,
    },
    text(message),
    {
      type: VirtualDomElements.Div,
      className: 'LocationList',
      role: AriaRoles.Tree,
      ariaLabel: 'Locations',
      tabIndex: 0,
      ariaDescribedBy: 'LocationsMessage',
      childCount: locations.length,
    },
    ...locations.flatMap(getLocationVirtualDom),
  )
  return dom
}
