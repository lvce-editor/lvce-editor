import * as AriaRoles from '../AriaRoles/AriaRoles.js'
import * as ClassNames from '../ClassNames/ClassNames.js'
import type { DebugRow } from '../DebugRow/DebugRow.ts'
import * as GetChevronVirtualDom from '../GetChevronVirtualDom/GetChevronVirtualDom.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import * as VirtualDomHelpers from '../VirtualDomHelpers/VirtualDomHelpers.js'
import type { VirtualDomNode } from '../VirtualDomNode/VirtualDomNode.ts'

export const renderSectionHeading = (row: DebugRow): readonly VirtualDomNode[] => {
  const { expanded } = row
  return [
    {
      type: VirtualDomElements.Div,
      className: ClassNames.DebugSectionHeader,
      role: AriaRoles.TreeItem,
      ariaExpanded: expanded,
      ariaLevel: 1,
      childCount: 2,
      onClick: 'handleClickSectionHeading',
    },
    expanded ? GetChevronVirtualDom.getChevronDownVirtualDom() : GetChevronVirtualDom.getChevronRightVirtualDom(),
    VirtualDomHelpers.text(row.text),
  ]
}
