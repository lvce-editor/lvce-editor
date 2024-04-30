import * as DebugItemFlags from '../DebugItemFlags/DebugItemFlags.js'
import * as DebugScopeChainType from '../DebugScopeChainType/DebugScopeChainType.js'
import * as DebugStrings from '../DebugStrings/DebugStrings.js'
import type { DebugRow } from '../DebugRow/DebugRow.ts'
import * as GetVisibleScopeItems from '../GetVisibleScopeItems/GetVisibleScopeItems.js'

const getRunAndDebugVisibleRowsWatch = (state): readonly DebugRow[] => {
  const { watchExpanded } = state
  return [
    {
      type: 'section-heading',
      text: DebugStrings.watch(),
      expanded: watchExpanded,
      key: '',
      value: '',
      indent: 0,
      valueType: '',
    },
  ]
}

const getRunAndDebugVisibleRowsBreakPoints = (state): readonly DebugRow[] => {
  const { breakPointsExpanded } = state
  return [
    {
      type: 'section-heading',
      text: DebugStrings.breakPoints(),
      expanded: breakPointsExpanded,
      key: '',
      value: '',
      indent: 0,
      valueType: '',
    },
  ]
}

const getScopeThisRows = (scope): readonly DebugRow[] => {
  const { indent, key, value, valueType } = scope
  return [
    {
      type: 'value',
      text: '',
      expanded: false,
      key,
      value,
      indent,
      valueType,
    },
  ]
}

const getScopeExceptionRows = (scope): readonly DebugRow[] => {
  const { key, value } = scope
  return [
    {
      type: 'exception',
      text: '',
      expanded: false,
      key,
      value,
      indent: 0,
      valueType: '',
    },
  ]
}

const getScopeScopeRows = (scope): readonly DebugRow[] => {
  const { key, flags } = scope
  return [
    {
      type: 'scope',
      text: '',
      expanded: flags & DebugItemFlags.Expanded,
      key,
      value: '',
      indent: 0,
      valueType: '',
    },
  ]
}

const getScopePropertyRows = (scope): readonly DebugRow[] => {
  const { indent, key, value, valueType, flags } = scope
  return [
    {
      type: 'property',
      text: '',
      expanded: flags & DebugItemFlags.Expanded,
      key,
      value,
      indent,
      valueType,
    },
  ]
}

const getNoopRows = () => {
  return []
}

const getScopeRenderer = (type) => {
  switch (type) {
    case DebugScopeChainType.This:
      return getScopeThisRows
    case DebugScopeChainType.Exception:
      return getScopeExceptionRows
    case DebugScopeChainType.Scope:
      return getScopeScopeRows
    case DebugScopeChainType.Property:
      return getScopePropertyRows
    default:
      return getNoopRows
  }
}

const getRunAndDebugVisibleRowsScope = (state): readonly DebugRow[] => {
  const rows: DebugRow[] = []
  const { scopeChain, scopeExpanded, expandedIds, scopeFocusedIndex } = state
  if (scopeExpanded) {
    rows.push({
      type: 'section-heading',
      text: DebugStrings.scope(),
      expanded: true,
      key: '',
      value: '',
      indent: 0,
      valueType: '',
    })
    if (scopeChain.length === 0) {
      rows.push({
        type: 'message',
        text: DebugStrings.notPaused(),
        expanded: false,
        key: '',
        value: '',
        indent: 0,
        valueType: '',
      })
    } else {
      const visible = GetVisibleScopeItems.getVisibleScopeItems(scopeChain, expandedIds, scopeFocusedIndex)
      for (const scope of visible) {
        const renderer = getScopeRenderer(scope.type)
        rows.push(...renderer(scope))
      }
    }
  } else {
    rows.push({
      type: 'section-heading',
      text: DebugStrings.scope(),
      expanded: false,
      key: '',
      value: '',
      indent: 0,
      valueType: '',
    })
  }
  return rows
}

export const getRunAndDebugVisibleRows = (state) => {
  const rows = [...getRunAndDebugVisibleRowsWatch(state), ...getRunAndDebugVisibleRowsBreakPoints(state), ...getRunAndDebugVisibleRowsScope(state)]

  return rows
}
