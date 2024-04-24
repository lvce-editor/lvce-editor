import * as ClassNames from '../ClassNames/ClassNames.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.js'

const cell = {
  type: VirtualDomElements.Td,
  className: ClassNames.KeyBindingsTableCell,
  childCount: 1,
}

export const getKeyBindingsTableCellWhenDom = (keyBinding) => {
  const { when } = keyBinding
  const dom = []
  dom.push(cell, text(when || ''))
  return dom
}
