import * as ClassNames from '../ClassNames/ClassNames.js'
import * as KeyBindingStrings from '../KeyBindingStrings/KeyBindingStrings.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.js'

const tableHead = {
  type: VirtualDomElements.THead,
  className: ClassNames.KeyBindingsTableHead,
  childCount: 1,
}

const tableHeadRow = {
  type: VirtualDomElements.Tr,
  className: ClassNames.KeyBindingsTableRow,
  ariaRowIndex: 1,
  childCount: 4,
}

const tableHeading = {
  type: VirtualDomElements.Th,
  className: ClassNames.KeyBindingsTableCell,
  childCount: 1,
}

const staticTableHeadDom = [
  tableHead,
  tableHeadRow,
  tableHeading,
  text(''),
  tableHeading,
  text(KeyBindingStrings.command()),
  tableHeading,
  text(KeyBindingStrings.key()),
  tableHeading,
  text(KeyBindingStrings.when()),
]

export const getKeyBindingsTableHeadVirtualDom = () => {
  return staticTableHeadDom
}
