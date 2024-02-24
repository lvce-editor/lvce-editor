import * as AriaRoles from '../AriaRoles/AriaRoles.js'
import * as ClassNames from '../ClassNames/ClassNames.js'
import * as DebugScopeChainType from '../DebugScopeChainType/DebugScopeChainType.js'
import * as GetChevronVirtualDom from '../GetChevronVirtualDom/GetChevronVirtualDom.js'
import * as GetScopeExceptionVirtualDom from '../GetScopeExceptionVirtualDom/GetScopeExceptionVirtualDom.js'
import * as GetScopePropertyVirtualDom from '../GetScopePropertyVirtualDom/GetScopePropertyVirtualDom.js'
import * as GetScopeScopeVirtualDom from '../GetScopeScopeVirtualDom/GetScopeScopeVirtualDom.js'
import * as GetScopeThisVirtualDom from '../GetScopeThisVirtualDom/GetScopeThisVirtualDom.js'
import * as GetVisibleScopeItems from '../GetVisibleScopeItems/GetVisibleScopeItems.js'
import * as ViewletRunAndDebugStrings from '../ViewletRunAndDebug/ViewletRunAndDebugStrings.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.js'

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

const debugPausedMessage = {
  type: VirtualDomElements.Div,
  className: ClassNames.DebugPausedMessage,
  childCount: 1,
}
const textNotPaused = text(ViewletRunAndDebugStrings.notPaused())

const textScope = text(ViewletRunAndDebugStrings.scope())

const getNoopVirtualDom = () => {
  return []
}

const getScopeRenderer = (type) => {
  switch (type) {
    case DebugScopeChainType.This:
      return GetScopeThisVirtualDom.getScopeThisVirtualDom
    case DebugScopeChainType.Exception:
      return GetScopeExceptionVirtualDom.getScopeExceptionVirtualDom
    case DebugScopeChainType.Scope:
      return GetScopeScopeVirtualDom.getScopeScopeVirtualDom
    case DebugScopeChainType.Property:
      return GetScopePropertyVirtualDom.getScopePropertyVirtualDom
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
