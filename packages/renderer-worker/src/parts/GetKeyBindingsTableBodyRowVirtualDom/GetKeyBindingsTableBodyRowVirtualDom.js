import * as ClassNames from '../ClassNames/ClassNames.js'
import * as GetKeyBindingsTableBodyRowClassName from '../GetKeyBindingsTableBodyRowClassName/GetKeyBindingsTableBodyRowClassName.js'
import * as GetKeyBindingsTableCellCommandVirtualDom from '../GetKeyBindingsTableCellCommandVirtualDom/GetKeyBindingsTableCellCommandVirtualDom.js'
import * as GetKeyBindingsTableCellEditVirtualDom from '../GetKeyBindingsTableCellEditVirtualDom/GetKeyBindingsTableCellEditVirtualDom.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.js'

const kbdDom = {
  type: VirtualDomElements.Kbd,
  className: ClassNames.Key,
  childCount: 1,
}

const textCtrl = text('Ctrl')
const textShift = text('Shift')
const textPlus = text('+')

// TODO needing childCount variable everywhere can be error prone
const getKeyBindingCellChildren = (keyBinding) => {
  const { isCtrl, isShift, key, keyMatches, commandMatches } = keyBinding
  const children = []
  let childCount = 0
  if (isCtrl) {
    childCount += 2
    children.push(kbdDom, textCtrl, textPlus)
  }
  if (isShift) {
    childCount += 2
    children.push(kbdDom, textShift, textPlus)
  }
  childCount++
  children.push(kbdDom, text(key))
  return { children, childCount }
}

export const getKeyBindingsTableBodyRowDom = (keyBinding) => {
  const { children, childCount } = getKeyBindingCellChildren(keyBinding)
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
  dom.push(
    {
      type: VirtualDomElements.Td,
      className: ClassNames.KeyBindingsTableCell,
      childCount,
    },
    ...children,
    {
      type: VirtualDomElements.Td,
      className: ClassNames.KeyBindingsTableCell,
      childCount: 1,
    },
    text(keyBinding.when || ''),
  )
  return dom
}
