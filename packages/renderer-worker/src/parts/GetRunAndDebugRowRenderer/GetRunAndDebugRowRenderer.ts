import * as AriaRoles from '../AriaRoles/AriaRoles.js'
import * as ClassNames from '../ClassNames/ClassNames.js'
import type { DebugRow } from '../DebugRow/DebugRow.ts'
import * as DebugRowType from '../DebugRowType/DebugRowType.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.js'
import * as GetChevronVirtualDom from '../GetChevronVirtualDom/GetChevronVirtualDom.js'
import * as GetDebugValueClassName from '../GetDebugValueClassName/GetDebugValueClassName.js'
import * as GetRunAndDebugRowSectionHeadingVirtualDom from '../GetRunAndDebugRowSectionHeadingVirtualDom/GetRunAndDebugRowSectionHeadingVirtualDom.ts'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import * as VirtualDomHelpers from '../VirtualDomHelpers/VirtualDomHelpers.js'
import type { VirtualDomNode } from '../VirtualDomNode/VirtualDomNode.ts'

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

const renderCallStack = (row: DebugRow): readonly VirtualDomNode[] => {
  const { text } = row
  return [
    {
      type: VirtualDomElements.Div,
      className: ClassNames.DebugRow + ' DebugRowCallStack',
      role: AriaRoles.TreeItem,
      ariaLevel: 2,
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
      role: AriaRoles.TreeItem,
      ariaExpanded: expanded,
      ariaLevel: 2,
      childCount: 2,
      onPointerDown: DomEventListenerFunctions.HandleClickScopeValue,
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
  const { indent, key, value, valueType, expanded } = row
  const className = GetDebugValueClassName.getDebugValueClassName(valueType)

  return [
    {
      type: VirtualDomElements.Div,
      className: ClassNames.DebugRow,
      role: AriaRoles.TreeItem,
      ariaExpanded: expanded,
      ariaLevel: 3,
      paddingLeft: indent,
      onPointerDown: DomEventListenerFunctions.HandleClickScopeValue,
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

export const getRowRenderer = (type: number) => {
  switch (type) {
    case DebugRowType.Message:
      return renderMessage
    case DebugRowType.SectionHeading:
      return GetRunAndDebugRowSectionHeadingVirtualDom.renderSectionHeading
    case DebugRowType.CallStack:
      return renderCallStack
    case DebugRowType.Scope:
      return renderScope
    case DebugRowType.Value:
    case DebugRowType.Property:
    case DebugRowType.Exception:
      return renderValue
    default:
      return renderNoop
  }
}
