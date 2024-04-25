import * as ClassNames from '../ClassNames/ClassNames.js'
import * as GetKeyBindingsHeaderVirtualDom from '../GetKeyBindingsHeaderVirtualDom/GetKeyBindingsHeaderVirtualDom.js'
import * as GetKeyBindingsTableVirtualDom from '../GetKeyBindingsTableVirtualDom/GetKeyBindingsTableVirtualDom.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'

export const getKeyBindingsVirtualDom = (
  filteredKeyBindings,
  displayKeyBindings,
  columnWidth1,
  columnWidth2,
  columnWidth3,
  scrollBarThumbHeight,
  scrollBarThumbTop,
) => {
  return [
    {
      type: VirtualDomElements.Div,
      className: 'Viewlet KeyBindings',
      onPointerDown: 'handlePointerDown',
      onDblClick: 'handleTableDoubleClick',
      onWheel: 'handleWheel',
      childCount: 3,
    },
    ...GetKeyBindingsHeaderVirtualDom.getKeyBindingsHeaderVirtualDom(),
    {
      type: VirtualDomElements.Div,
      className: ClassNames.KeyBindingsTableWrapper,
      childCount: 3,
    },
    {
      type: VirtualDomElements.Div,
      className: ClassNames.Resizer,
      childCount: 0,
    },
    {
      type: VirtualDomElements.Div,
      className: ClassNames.Resizer,
      childCount: 0,
    },
    ...GetKeyBindingsTableVirtualDom.getTableDom(filteredKeyBindings, displayKeyBindings, columnWidth1, columnWidth2, columnWidth3),
    {
      type: VirtualDomElements.Div,
      className: ClassNames.ScrollBar,
      childCount: 1,
    },
    {
      type: VirtualDomElements.Div,
      className: ClassNames.ScrollBarThumb,
      childCount: 0,
      height: `${scrollBarThumbHeight}px`,
      top: `${scrollBarThumbTop}px`,
    },
  ]
}
