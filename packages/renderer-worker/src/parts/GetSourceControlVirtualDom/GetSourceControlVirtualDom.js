import * as GetSourceControlItemsVirtualDom from '../GetSourceControlItemsVirtualDom/GetSourceControlItemsVirtualDom.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'

export const getSourceControlVirtualDom = (items, splitButtonEnabled) => {
  const dom = [
    {
      type: VirtualDomElements.Div,
      className: 'Viewlet SourceControl',
      tabIndex: 0,
      onClick: 'handleClick',
      onContextMenu: 'handleContextMenu',
      onMouseOver: 'handleMouseOver',
      onMouseOut: 'handleMouseOut',
      onWheel: 'handleWheel',
      childCount: splitButtonEnabled ? 3 : 2,
    },
    ...GetSourceControlItemsVirtualDom.getSourceControlItemsVirtualDom(items, splitButtonEnabled),
  ]
  return dom
}
