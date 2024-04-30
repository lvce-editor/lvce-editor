import type { DebugRow } from '../DebugRow/DebugRow.ts'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import * as ClassNames from '../ClassNames/ClassNames.js'
import * as VirtualDomHelpers from '../VirtualDomHelpers/VirtualDomHelpers.js'
import * as GetChevronVirtualDom from '../GetChevronVirtualDom/GetChevronVirtualDom.js'
import type { VirtualDomNode } from '../VirtualDomNode/VirtualDomNode.ts'

const renderNoop = (row: DebugRow): readonly VirtualDomNode[] => {
  return [
    {
      type: VirtualDomElements.Div,
      childCount: 1,
    },
    VirtualDomHelpers.text('unknown row type'),
  ]
}

const renderSectionHeading = (row: DebugRow): readonly VirtualDomNode[] => {
  const { expanded } = row
  return [
    {
      type: VirtualDomElements.Div,
      className: ClassNames.DebugSectionHeader,
      ariaExpanded: expanded,
      childCount: 2,
    },
    expanded ? GetChevronVirtualDom.getChevronDownVirtualDom() : GetChevronVirtualDom.getChevronRightVirtualDom(),
    VirtualDomHelpers.text(row.text),
  ]
}

// TODO use number for type
const getRowRenderer = (type: string) => {
  switch (type) {
    case 'section-heading':
      return renderSectionHeading
    default:
      return renderNoop
  }
}
const renderDebugRow = (row) => {
  const renderer = getRowRenderer(row.type)
  return renderer(row)
}

export const getRunAndDebugVirtualDom2 = (rows: readonly DebugRow[]): readonly VirtualDomNode[] => {
  return [
    {
      type: VirtualDomElements.Div,
      className: 'Viewlet RunAndDebug',
      tabIndex: 0,
      childCount: rows.length,
    },
    ...rows.flatMap(renderDebugRow),
  ]
}
