import * as AriaRoles from '../AriaRoles/AriaRoles.js'
import * as ClassNames from '../ClassNames/ClassNames.js'
import * as LocationType from '../LocationType/LocationType.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.js'

const getLeafVirtualDom = (location) => {
  const { lineText, index, startOffset, endOffset } = location
  const dom = []
  dom.push({
    type: VirtualDomElements.Div,
    className: ClassNames.TreeItem,
    id: `Reference-${index}`,
    childCount: 1,
    paddingLeft: '2rem',
  })
  if (startOffset === endOffset) {
    dom.push(
      {
        type: VirtualDomElements.Div,
        className: 'Label',
        childCount: 1,
      },
      text(lineText || '(empty line)'),
    )
  } else {
    const before = lineText.slice(0, startOffset)
    const middle = lineText.slice(startOffset, endOffset)
    const end = lineText.slice(endOffset)
    dom.push(
      {
        type: VirtualDomElements.Div,
        className: 'Label',
        childCount: 3,
      },
      text(before),
      {
        type: VirtualDomElements.Span,
        className: 'Highlight',
        childCount: 1,
      },
      text(middle),
      text(end),
    )
  }
  return dom
}

const getCollapsedVirtualDom = (location) => {
  const { index, name } = location
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
}

const getExpandedVirtualDom = (location) => {
  const { index, name, icon } = location
  return [
    {
      type: VirtualDomElements.Div,
      className: ClassNames.TreeItem,
      ariaExpanded: true,
      id: `Reference-${index}`,
      childCount: 2,
      paddingLeft: '1rem',
    },
    {
      type: VirtualDomElements.Img,
      className: 'FileIcon',
      src: icon,
    },
    text(name),
  ]
}

const getLocationVirtualDom = (location) => {
  const { type } = location
  switch (type) {
    case LocationType.Leaf:
      return getLeafVirtualDom(location)
    case LocationType.Collapsed:
      return getCollapsedVirtualDom(location)
    case LocationType.Expanded:
      return getExpandedVirtualDom(location)
    default:
      return []
  }
}

export const getLocationsVirtualDom = (locations, message) => {
  const dom = []
  dom.push({
    type: VirtualDomElements.Div,
    className: 'Viewlet Locations',
    onMouseDown: 'handleLocationsMouseDown',
    childCount: 2,
  })
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
