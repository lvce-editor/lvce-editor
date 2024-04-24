import * as ClassNames from '../ClassNames/ClassNames.js'
import * as GetIconVirtualDom from '../GetIconVirtualDom/GetIconVirtualDom.js'
import * as Icon from '../Icon/Icon.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'

export const getKeyBindingsTableEditCellDom = () => {
  const dom = []
  dom.push(
    {
      type: VirtualDomElements.Td,
      childCount: 1,
      className: ClassNames.KeyBindingsTableCell,
    },
    {
      type: VirtualDomElements.Button,
      className: `${ClassNames.IconButton} ${ClassNames.KeyBindingsEditButton}`,
      childCount: 1,
    },
    GetIconVirtualDom.getIconVirtualDom(Icon.Edit),
  )
  return dom
}
