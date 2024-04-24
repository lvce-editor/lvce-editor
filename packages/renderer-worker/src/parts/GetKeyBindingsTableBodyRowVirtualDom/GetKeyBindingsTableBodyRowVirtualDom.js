import * as GetKeyBindingsTableBodyRowClassName from '../GetKeyBindingsTableBodyRowClassName/GetKeyBindingsTableBodyRowClassName.js'
import * as GetKeyBindingsTableCellCommandVirtualDom from '../GetKeyBindingsTableCellCommandVirtualDom/GetKeyBindingsTableCellCommandVirtualDom.js'
import * as GetKeyBindingsTableCellEditVirtualDom from '../GetKeyBindingsTableCellEditVirtualDom/GetKeyBindingsTableCellEditVirtualDom.js'
import * as GetKeyBindingsTableCellKeyVirtualDom from '../GetKeyBindingsTableCellKeyVirtualDom/GetKeyBindingsTableCellKeyVirtualDom.js'
import * as GetKeyBindingsTableCellWhenVirtualDom from '../GetKeyBindingsTableCellWhenVirtualDom/GetKeyBindingsTableCellWhenVirtualDom.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'

export const getKeyBindingsTableBodyRowDom = (keyBinding) => {
  const { rowIndex, selected } = keyBinding
  const isEven = rowIndex % 2 === 0
  const className = GetKeyBindingsTableBodyRowClassName.getRowClassName(isEven, selected)
  const dom = []
  dom.push({
    type: VirtualDomElements.Tr,
    ariaRowIndex: rowIndex,
    className,
    key: rowIndex,
    childCount: 4,
  })
  dom.push(...GetKeyBindingsTableCellEditVirtualDom.getKeyBindingsTableEditCellDom())
  dom.push(...GetKeyBindingsTableCellCommandVirtualDom.getKeyBindingsTableCellCommandDom(keyBinding))
  dom.push(...GetKeyBindingsTableCellKeyVirtualDom.getKeyBindingsTableCellKeyDom(keyBinding))
  dom.push(...GetKeyBindingsTableCellWhenVirtualDom.getKeyBindingsTableCellWhenDom(keyBinding))
  return dom
}
