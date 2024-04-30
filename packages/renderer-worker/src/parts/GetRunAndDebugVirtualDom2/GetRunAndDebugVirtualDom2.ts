import type { DebugRow } from '../DebugRow/DebugRow.ts'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import * as ClassNames from '../ClassNames/ClassNames.js'
import * as VirtualDomHelpers from '../VirtualDomHelpers/VirtualDomHelpers.js'
import * as GetChevronVirtualDom from '../GetChevronVirtualDom/GetChevronVirtualDom.js'
import * as DebugRowType from '../DebugRowType/DebugRowType.ts'
import type { VirtualDomNode } from '../VirtualDomNode/VirtualDomNode.ts'
import * as GetDebugValueClassName from '../GetDebugValueClassName/GetDebugValueClassName.js'

const separator = VirtualDomHelpers.text(': ')

const renderNoop = (row: DebugRow): readonly VirtualDomNode[] => {
  return [
    {
      type: VirtualDomElements.Div,
      childCount: 1,
    },
    VirtualDomHelpers.text('unknown row type'),
  ]
}

const renderMessage = (row: DebugRow): readonly VirtualDomNode[] => {
  const { text } = row
  return [
    {
      type: VirtualDomElements.Div,
      className: ClassNames.DebugPausedMessage,
      childCount: 1,
    },
    VirtualDomHelpers.text(text),
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

const renderCallStack = (row: DebugRow): readonly VirtualDomNode[] => {
  const { text } = row
  return [
    {
      type: VirtualDomElements.Div,
      className: ClassNames.DebugRow + ' DebugRowCallStack',
      childCount: 1,
    },
    VirtualDomHelpers.text(text),
  ]
}

const renderScope = (row: DebugRow): readonly VirtualDomNode[] => {
  const { key, expanded } = row
  let className = ClassNames.DebugRow
  return [
    {
      type: VirtualDomElements.Div,
      className,
      ariaExpanded: expanded,
      childCount: 2,
    },
    expanded ? GetChevronVirtualDom.getChevronDownVirtualDom() : GetChevronVirtualDom.getChevronRightVirtualDom(),
    {
      type: VirtualDomElements.Span,
      className: 'DebugValue DebugValueScopeName',
      childCount: 1,
    },
    VirtualDomHelpers.text(key),
  ]
}

const renderValue = (row: DebugRow): readonly VirtualDomNode[] => {
  const { indent, key, value, valueType } = row
  const className = GetDebugValueClassName.getDebugValueClassName(valueType)

  return [
    {
      type: VirtualDomElements.Div,
      className: ClassNames.DebugRow,
      paddingLeft: indent,
      childCount: 3,
    },
    {
      type: VirtualDomElements.Span,
      className: 'DebugValue DebugPropertyKey',
      childCount: 1,
    },
    VirtualDomHelpers.text(key),
    separator,
    {
      type: VirtualDomElements.Span,
      className: 'DebugValue ' + className,
      childCount: 1,
    },
    VirtualDomHelpers.text(value),
  ]
}

const getRowRenderer = (type: number) => {
  switch (type) {
    case DebugRowType.Message:
      return renderMessage
    case DebugRowType.SectionHeading:
      return renderSectionHeading
    case DebugRowType.CallStack:
      return renderCallStack
    case DebugRowType.Scope:
      return renderScope
    case DebugRowType.Value:
      return renderValue
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
