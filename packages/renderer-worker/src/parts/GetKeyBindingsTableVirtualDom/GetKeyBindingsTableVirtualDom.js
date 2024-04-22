import * as ClassNames from '../ClassNames/ClassNames.js'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.js'
import * as GetKeyBindingsTableBodyVirtualDom from '../GetKeyBindingsTableBodyVirtualDom/GetKeyBindingsTableBodyVirtualDom.js'
import * as GetKeyBindingsTableHeadVirtualDom from '../GetKeyBindingsTableHeadVirtualDom/GetKeyBindingsTableHeadVirtualDom.js'
import * as ViewletKeyBindingsStrings from '../ViewletKeyBindings/ViewletKeyBindingsStrings.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'

export const getTableDom = (filteredKeyBindings, displayKeyBindings, columnWidth1, columnWidth2, columnWidth3) => {
  const tableDom = [
    {
      type: VirtualDomElements.Table,
      className: ClassNames.KeyBindingsTable,
      ariaLabel: ViewletKeyBindingsStrings.keyBindings(),
      ariaRowCount: filteredKeyBindings.length,
      onClick: DomEventListenerFunctions.HandleTableClick,
      tabIndex: 0,
      childCount: 3,
    },
    {
      type: VirtualDomElements.ColGroup,
      className: ClassNames.KeyBindingsTableColGroup,
      childCount: 4,
    },
    {
      type: VirtualDomElements.Col,
      className: ClassNames.KeyBindingsTableCol,
      width: 30,
      childCount: 0,
    },
    {
      type: VirtualDomElements.Col,
      className: ClassNames.KeyBindingsTableCol,
      width: columnWidth1,
      childCount: 0,
    },
    {
      type: VirtualDomElements.Col,
      className: ClassNames.KeyBindingsTableCol,
      width: columnWidth2,
      childCount: 0,
    },
    {
      type: VirtualDomElements.Col,
      className: ClassNames.KeyBindingsTableCol,
      width: columnWidth3 - 30,
      childCount: 0,
    },
    ...GetKeyBindingsTableHeadVirtualDom.getKeyBindingsTableHeadVirtualDom(),
    ...GetKeyBindingsTableBodyVirtualDom.getKeyBindingsTableBodyDom(displayKeyBindings),
  ]
  return tableDom
}
