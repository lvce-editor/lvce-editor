import * as AriaRoles from '../AriaRoles/AriaRoles.js'
import * as ClassNames from '../ClassNames/ClassNames.js'
import * as DebugScopeChainType from '../DebugScopeChainType/DebugScopeChainType.js'
import * as GetDebugValueClassName from '../GetDebugValueClassName/GetDebugValueClassName.js'
import * as ViewletRunAndDebugStrings from '../ViewletRunAndDebug/ViewletRunAndDebugStrings.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.js'

const iconTriangleRight = {
  type: VirtualDomElements.Div,
  className: ClassNames.DebugMaskIcon + ' MaskIconTriangleRight',
  childCount: 0,
}

const iconTriangleDown = {
  type: VirtualDomElements.Div,
  className: ClassNames.DebugMaskIcon + ' MaskIconTriangleDown',
  childCount: 0,
}

const debugRow1 = {
  type: VirtualDomElements.Div,
  className: ClassNames.DebugRow,
  childCount: 1,
  onPointerDown: 'handleClickScopeValue',
}
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
  const { key } = scope
  return [
    {
      type: VirtualDomElements.Div,
      className: ClassNames.DebugRow,
      childCount: 2,
      onPointerDown: 'handleClickScopeValue',
    },
    iconTriangleRight,
    {
      type: VirtualDomElements.Span,
      className: 'DebugValue',
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

export const getRunAndDebugScopeVirtualDom = (state) => {
  const { scopeChain, scopeExpanded } = state
  const elements = []
  if (scopeExpanded) {
    elements.push(scopeHeaderExpanded, iconTriangleDown, textScope)
    if (scopeChain.length === 0) {
      elements.push(debugPausedMessage, textNotPaused)
    } else {
      for (const scope of scopeChain) {
        const { type } = scope
        switch (type) {
          case DebugScopeChainType.This:
            elements.push(...getScopeThisVirtualDom(scope))
            break
          case DebugScopeChainType.Exception:
            elements.push(...getScopeExceptionVirtualDom(scope))
            break
          case DebugScopeChainType.Scope:
            elements.push(...getScopeScopeVirtualDom(scope))
            break
          case DebugScopeChainType.Property:
            elements.push(...getScopePropertyVirtualDom(scope))
            break
          default:
            break
        }
      }
    }
  } else {
    elements.push(scopeHeader, iconTriangleRight, textScope)
  }
  return elements
}
