import * as ClassNames from '../ClassNames/ClassNames.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'

export const getKeyBindingsTableColGroupVirtualDom = (columnWidth1, columnWidth2, columnWidth3) => {
  const tableDom = [
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
  ]
  return tableDom
}
