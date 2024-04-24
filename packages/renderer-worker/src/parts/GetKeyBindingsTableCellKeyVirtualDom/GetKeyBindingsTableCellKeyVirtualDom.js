import * as ClassNames from '../ClassNames/ClassNames.js'
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
  const { isCtrl, isShift, key } = keyBinding
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

export const getKeyBindingsTableCellKeyDom = (keyBinding) => {
  const { children, childCount } = getKeyBindingCellChildren(keyBinding)
  const dom = []
  dom.push(
    {
      type: VirtualDomElements.Td,
      className: ClassNames.KeyBindingsTableCell,
      childCount,
    },
    ...children,
  )
  return dom
}
