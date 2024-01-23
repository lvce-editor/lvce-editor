import * as AriaRoles from '../AriaRoles/AriaRoles.js'
import * as ClassNames from '../ClassNames/ClassNames.js'
import * as DebugScopeChainType from '../DebugScopeChainType/DebugScopeChainType.js'
import * as GetChevronVirtualDom from '../GetChevronVirtualDom/GetChevronVirtualDom.js'
import * as GetDebugValueClassName from '../GetDebugValueClassName/GetDebugValueClassName.js'
import * as GetVisibleScopeItems from '../GetVisibleScopeItems/GetVisibleScopeItems.js'
import * as ViewletRunAndDebugStrings from '../ViewletRunAndDebug/ViewletRunAndDebugStrings.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.js'

const debugRow3 = {
  type: VirtualDomElements.Div,
  className: ClassNames.DebugRow,
  childCount: 3,
  onPointerDown: 'handleClickScopeValue',
}

const scopeHeader = {
  type: VirtualDomElements.Div,
  className: ClassNames.DebugSectionHeader,
  role: AriaRoles.TreeItem,
  ariaLevel: 1,
  ariaExpanded: false,
  tabIndex: 0,
  childCount: 2,
  onPointerDown: 'handleClickSectionScope',
}
const scopeHeaderExpanded = {
  type: VirtualDomElements.Div,
  className: ClassNames.DebugSectionHeader,
  role: AriaRoles.TreeItem,
  ariaLevel: 1,
  ariaExpanded: true,
  childCount: 2,
  onPointerDown: 'handleClickSectionScope',
}
const textScope = text(ViewletRunAndDebugStrings.scope())
const separator = text(': ')
const debugPropertyKey = {
  type: VirtualDomElements.Span,
  className: 'DebugValue ' + ClassNames.DebugPropertyKey,
  childCount: 1,
}

const debugPausedMessage = {
  type: VirtualDomElements.Div,
  className: ClassNames.DebugPausedMessage,
  childCount: 1,
}
const textNotPaused = text(ViewletRunAndDebugStrings.notPaused())

const getScopeThisVirtualDom = (scope) => {
  const { indent, key, value, valueType } = scope
  const className = GetDebugValueClassName.getDebugValueClassName(valueType)
  return [
    {
      type: VirtualDomElements.Div,
      className: ClassNames.DebugRow,
      paddingLeft: indent,
      childCount: 3,
      onPointerDown: 'handleClickScopeValue',
    },
    {
      type: VirtualDomElements.Span,
      className: 'DebugValue DebugPropertyKey',
      childCount: 1,
    },
    text(key),
    separator,
    {
      type: VirtualDomElements.Span,
      className: 'DebugValue ' + className,
      childCount: 1,
    },
    text(value),
  ]
}

const getScopeExceptionVirtualDom = (scope) => {
  const { key, value } = scope
  return [
    debugRow3,
    {
      type: VirtualDomElements.Span,
      childCount: 1,
    },
    text(key),
    separator,

    {
      type: VirtualDomElements.Span,
      childCount: 1,
    },
    text(value),
  ]
}

const getScopeScopeVirtualDom = (scope) => {
  const { key, isExpanded, isFocused } = scope
  let className = ClassNames.DebugRow
  if (isFocused) {
    className += ' TreeItemActive'
  }
  return [
    {
      type: VirtualDomElements.Div,
      className,
      childCount: 2,
      onPointerDown: 'handleClickScopeValue',
      ariaExpanded: isExpanded,
    },
    isExpanded ? GetChevronVirtualDom.getChevronDownVirtualDom() : GetChevronVirtualDom.getChevronRightVirtualDom(),
    {
      type: VirtualDomElements.Span,
      className: 'DebugValue DebugValueScopeName',
      childCount: 1,
    },
    text(key),
  ]
}

const getScopePropertyVirtualDom = (scope) => {
  const { indent, key, value, valueType } = scope
  const className = GetDebugValueClassName.getDebugValueClassName(valueType)
  return [
    {
      type: VirtualDomElements.Div,
      className: ClassNames.DebugRow,
      paddingLeft: indent,
      childCount: 3,
      onPointerDown: 'handleClickScopeValue',
    },
    debugPropertyKey,
    text(key),
    separator,
    {
      type: VirtualDomElements.Span,
      className: 'DebugValue ' + className,
      childCount: 1,
    },
    text(value),
  ]
}

const getNoopVirtualDom = () => {
  return []
}

const getScopeRenderer = (type) => {
  switch (type) {
    case DebugScopeChainType.This:
      return getScopeThisVirtualDom
    case DebugScopeChainType.Exception:
      return getScopeExceptionVirtualDom
    case DebugScopeChainType.Scope:
      return getScopeScopeVirtualDom
    case DebugScopeChainType.Property:
      return getScopePropertyVirtualDom
    default:
      return getNoopVirtualDom
  }
}

export const getRunAndDebugScopeVirtualDom = (state) => {
  const { scopeChain, scopeExpanded, expandedIds, scopeFocusedIndex } = state
  const elements = []
  if (scopeExpanded) {
    elements.push(scopeHeaderExpanded, GetChevronVirtualDom.getChevronDownVirtualDom(), textScope)
    if (scopeChain.length === 0) {
      elements.push(debugPausedMessage, textNotPaused)
    } else {
      const visible = GetVisibleScopeItems.getVisibleScopeItems(scopeChain, expandedIds, scopeFocusedIndex)
      for (const scope of visible) {
        const renderer = getScopeRenderer(scope.type)
        elements.push(...renderer(scope))
      }
    }
  } else {
    elements.push(scopeHeader, GetChevronVirtualDom.getChevronRightVirtualDom(), textScope)
  }
  return elements
}
