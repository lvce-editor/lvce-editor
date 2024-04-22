import * as ClassNames from '../ClassNames/ClassNames.js'
import * as ViewletKeyBindingsStrings from '../ViewletKeyBindings/ViewletKeyBindingsStrings.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.js'

const tableCellProps = {
  className: ClassNames.KeyBindingsTableCell,
}

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
  text(ViewletKeyBindingsStrings.command()),
  tableHeading,
  text(ViewletKeyBindingsStrings.key()),
  tableHeading,
  text(ViewletKeyBindingsStrings.when()),
]

export const getKeyBindingsTableHeadVirtualDom = () => {
  return staticTableHeadDom
}
